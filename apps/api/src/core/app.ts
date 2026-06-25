import express from "express";
import cors from "cors";
import helmet from "helmet";
import { apiRouteContracts, registerRequestSchema, loginRequestSchema } from "@campusflow/shared";
import { errorHandler, notFoundHandler, AppError } from "./errors";
import { getEnv } from "./env";
import { created, ok } from "./response";
import { getSupabaseAdmin, getSupabaseClient, getSupabaseSessionClient } from "./supabase";
import { automationService } from "../services/automation";
import { deadlineRouter } from "../modules/deadlines";
import { authMiddleware } from "./auth-middleware";
import { groupsRouter } from "../modules/groups";

export function createApp() {
  const app = express();
  const env = getEnv();

  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(authMiddleware);

  app.get("/health", (_request, response) => {
    ok(response, { ok: true, service: "campusflow-api", time: new Date().toISOString() });
  });

  app.post(apiRouteContracts.register.path, async (request, response, next) => {
    try {
      const body = registerRequestSchema.parse(request.body);
      const supabaseAdmin = getSupabaseAdmin();

      // Use admin.createUser to bypass email confirmation — user is immediately active
      const createResult = await supabaseAdmin.auth.admin.createUser({
        email: body.googleEmail,
        password: body.password,
        email_confirm: true,
        user_metadata: {
          name: body.name,
          branch: body.branch,
          year: body.year,
          subjects: body.subjects,
          phone_number: body.phoneNumber,
          google_email: body.googleEmail
        }
      });

      if (createResult.error || !createResult.data.user) {
        throw new AppError(400, createResult.error?.message ?? "Unable to register user");
      }

      const profileId = createResult.data.user.id;

      // Sign them in immediately to get a session token
      const supabaseClient = getSupabaseClient();
      const signInResult = await supabaseClient.auth.signInWithPassword({
        email: body.googleEmail,
        password: body.password
      });

      if (signInResult.error || !signInResult.data.session) {
        throw new AppError(400, "User created but sign-in failed: " + (signInResult.error?.message ?? "no session"));
      }

      const accessToken = signInResult.data.session.access_token;
      const profileClient = getSupabaseSessionClient(accessToken);

      // Upsert the profile record
      const { data: profile, error } = await profileClient
        .from("profiles")
        .upsert(
          {
            id: profileId,
            name: body.name,
            branch: body.branch,
            year: body.year,
            subjects: body.subjects,
            phone_number: body.phoneNumber,
            google_email: body.googleEmail
          },
          { onConflict: "id" }
        )
        .select("*")
        .single();

      if (error || !profile) {
        throw new AppError(400, error?.message ?? "Failed to create profile");
      }

      return created(response, {
        profile,
        session: {
          accessToken,
          refreshToken: signInResult.data.session.refresh_token,
          profileId
        }
      });
    } catch (error) {
      next(error);
    }
  });

  app.post(apiRouteContracts.login.path, async (request, response, next) => {
    try {
      const body = loginRequestSchema.parse(request.body);
      const supabase = getSupabaseClient();
      const authResult = await supabase.auth.signInWithPassword({ email: body.googleEmail, password: body.password });

      if (authResult.error || !authResult.data.user) {
        throw new AppError(401, authResult.error?.message ?? "Invalid login credentials");
      }

      if (!authResult.data.session?.access_token) {
        throw new AppError(401, "Login succeeded but no session was returned");
      }

      const profileClient = getSupabaseSessionClient(authResult.data.session.access_token);
      const { data: profile, error } = await profileClient.from("profiles").select("*").eq("id", authResult.data.user.id).single();

      if (error || !profile) {
        throw new AppError(404, error?.message ?? "Profile not found");
      }

      return created(response, {
        profile,
        session: {
          accessToken: authResult.data.session?.access_token ?? "",
          refreshToken: authResult.data.session?.refresh_token,
          profileId: authResult.data.user.id
        }
      });
    } catch (error) {
      next(error);
    }
  });

  app.get(apiRouteContracts.dashboardSummary.path, async (_request, response, next) => {
    try {
      const supabase = getSupabaseAdmin();
      const [tasksResult, groupsResult, sessionsResult] = await Promise.all([
        supabase.from("tasks").select("*").order("due_at", { ascending: true }).limit(10),
        supabase.from("study_groups").select("*").limit(10),
        supabase.from("study_sessions").select("*").order("scheduled_at", { ascending: true }).limit(10)
      ]);

      if (tasksResult.error) throw new AppError(400, tasksResult.error.message);
      if (groupsResult.error) throw new AppError(400, groupsResult.error.message);
      if (sessionsResult.error) throw new AppError(400, sessionsResult.error.message);

      const tasks = tasksResult.data ?? [];
      const scheduleItems = tasks.filter((task) => !task.completed);

      return ok(response, {
        scheduleItems,
        pendingTasks: tasks.filter((task) => !task.completed),
        summary: {
          totalTasks: tasks.length,
          dueToday: tasks.filter((task) => task.due_at?.startsWith(new Date().toISOString().slice(0, 10))).length,
          studyGroups: groupsResult.data?.length ?? 0,
          upcomingSessions: sessionsResult.data?.length ?? 0
        }
      });
    } catch (error) {
      next(error);
    }
  });

  app.get(apiRouteContracts.automationLogs.path, async (_request, response, next) => {
    try {
      const logs = await automationService.list(50);
      return ok(response, { logs });
    } catch (error) {
      next(error);
    }
  });

  app.use("/api/deadlines", deadlineRouter);

  app.get("/api/status", (_request, response) => {
    return ok(response, { ok: true, env: env.NODE_ENV });
  });

  app.use("/api", groupsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}