import { z } from "zod";
import { authSessionSchema, loginRequestSchema, registerRequestSchema } from "./schemas/auth";
import { automationEventSchema, automationWebhookEnvelopeSchema } from "./schemas/automation";
import { placementItemSchema, placementItemUpsertSchema } from "./schemas/placement";
import { profileSchema } from "./schemas/profile";
import { studyGroupSchema, studyGroupUpsertSchema, studySessionSchema, studySessionUpsertSchema } from "./schemas/groups";
import { taskSchema, taskUpsertSchema } from "./schemas/task";

export const apiRouteContracts = {
  register: {
    method: "POST",
    path: "/api/auth/register",
    requestSchema: registerRequestSchema,
    responseSchema: z.object({ profile: profileSchema, session: authSessionSchema })
  },
  login: {
    method: "POST",
    path: "/api/auth/login",
    requestSchema: loginRequestSchema,
    responseSchema: z.object({ profile: profileSchema, session: authSessionSchema })
  },
  dashboardSummary: {
    method: "GET",
    path: "/api/dashboard/summary",
    responseSchema: z.object({
      scheduleItems: z.array(taskSchema),
      pendingTasks: z.array(taskSchema),
      summary: z.object({
        totalTasks: z.number().int(),
        dueToday: z.number().int(),
        studyGroups: z.number().int(),
        upcomingSessions: z.number().int()
      })
    })
  },
  tasks: {
    method: "CRUD",
    path: "/api/tasks",
    requestSchema: taskUpsertSchema,
    responseSchema: taskSchema
  },
  placementItems: {
    method: "CRUD",
    path: "/api/placement/items",
    requestSchema: placementItemUpsertSchema,
    responseSchema: placementItemSchema
  },
  studyGroups: {
    method: "CRUD",
    path: "/api/study-groups",
    requestSchema: studyGroupUpsertSchema,
    responseSchema: studyGroupSchema
  },
  studySessions: {
    method: "CRUD",
    path: "/api/study-sessions",
    requestSchema: studySessionUpsertSchema,
    responseSchema: studySessionSchema
  },
  automationLogs: {
    method: "GET",
    path: "/api/automation/logs",
    responseSchema: z.object({ logs: z.array(automationEventSchema) })
  },
  automationWebhook: {
    method: "POST",
    path: "/webhooks/automation",
    requestSchema: automationWebhookEnvelopeSchema,
    responseSchema: z.object({ ok: z.literal(true) })
  }
} as const;

export type ApiRouteKey = keyof typeof apiRouteContracts;