import { z } from "zod";
import { automationEventTypes } from "../enums";
import { isoDateTimeSchema } from "./common";

export const automationEventSchema = z.object({
  id: z.string().min(1),
  eventType: z.enum(automationEventTypes),
  moduleKey: z.string().min(1),
  entityId: z.string().min(1),
  payload: z.record(z.unknown()),
  status: z.enum(["queued", "sent", "failed"]),
  errorMessage: z.string().optional(),
  createdAt: isoDateTimeSchema.optional(),
  updatedAt: isoDateTimeSchema.optional()
});

export type AutomationLogRecord = z.infer<typeof automationEventSchema>;

export const automationWebhookEnvelopeSchema = z.object({
  eventType: z.enum(automationEventTypes),
  moduleKey: z.string().min(1),
  entityId: z.string().min(1),
  source: z.literal("campusflow-backend"),
  occurredAt: isoDateTimeSchema,
  payload: z.record(z.unknown())
});

export type AutomationWebhookEnvelope = z.infer<typeof automationWebhookEnvelopeSchema>;