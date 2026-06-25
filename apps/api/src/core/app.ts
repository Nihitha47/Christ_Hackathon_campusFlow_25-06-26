import express from "express";
import cors from "cors";
import helmet from "helmet";
import { apiRouteContracts, registerRequestSchema, loginRequestSchema } from "@campusflow/shared";
import { errorHandler, notFoundHandler, AppError } from "./errors";
import { getEnv } from "./env";
import { created, ok } from "./response";
import { getSupabaseAdmin } from "./supabase";
import { automationService } from "../services/automation";
import { groupsRouter } from "../modules/groups";

export function createApp() {
  const app = express();
  const env = getEnv();

  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_request, response) => {
    ok(response, { ok: true, service: "campusflow-api", time: new Date().toISOString() });
  });

  app.post(apiRouteContracts.register.path, async (request, response, next) => {
    try {
      const body = registerRequestSchema.parse(request.body);
      const supabase = getSupabaseAdmin();

      const authResult = await supabase.auth.signUp({
        email: body.googleEmail,
        password: body.password,
        options: {
          data: {
            name: body.name,
            branch: body.branch,
            year: body.year,
            subjects: body.subjects,
            phone_number: body.phoneNumber,
            google_email: body.googleEmail
          }
        }
      });

      if (authResult.error || !authResult.data.user) {
        throw new AppError(400, authResult.error?.message ?? "Unable to register user");
      }

      const profileId = authResult.data.user.id;
      const { data: profile, error } = await supabase.from("profiles").upsert(
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
      ).select("*").single();

      if (error || !profile) {
        throw new AppError(400, error?.message ?? "Failed to create profile");
      }

      return created(response, {
        profile,
        session: {
          accessToken: authResult.data.session?.access_token ?? "",
          refreshToken: authResult.data.session?.refresh_token,
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
      const supabase = getSupabaseAdmin();
      const authResult = await supabase.auth.signInWithPassword({ email: body.googleEmail, password: body.password });

      if (authResult.error || !authResult.data.user) {
        throw new AppError(401, authResult.error?.message ?? "Invalid login credentials");
      }

      const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", authResult.data.user.id).single();

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

  app.get("/api/status", (_request, response) => {
    return ok(response, { ok: true, env: env.NODE_ENV });
  });

  app.use("/api", groupsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}