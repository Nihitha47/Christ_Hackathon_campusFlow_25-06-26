import { z } from "zod";
import { isoDateTimeSchema } from "./common";

export const studyGroupSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(160),
  subject: z.string().min(2).max(120),
  branch: z.string().min(2).max(120),
  year: z.number().int().min(1).max(4),
  description: z.string().max(1000).optional().default(""),
  createdAt: isoDateTimeSchema.optional(),
  updatedAt: isoDateTimeSchema.optional()
});

export type StudyGroupRecord = z.infer<typeof studyGroupSchema>;

export const studyGroupMemberSchema = z.object({
  id: z.string().min(1),
  groupId: z.string().min(1),
  profileId: z.string().min(1),
  role: z.enum(["owner", "member"]),
  createdAt: isoDateTimeSchema.optional()
});

export type StudyGroupMemberRecord = z.infer<typeof studyGroupMemberSchema>;

export const studySessionSchema = z.object({
  id: z.string().min(1),
  groupId: z.string().min(1),
  agenda: z.string().min(2).max(500),
  topic: z.string().min(2).max(160),
  scheduledAt: isoDateTimeSchema,
  durationMinutes: z.number().int().min(15).max(480),
  availability: z.string().min(2).max(200),
  addToCalendar: z.boolean().default(true),
  createdAt: isoDateTimeSchema.optional(),
  updatedAt: isoDateTimeSchema.optional()
});

export type StudySessionRecord = z.infer<typeof studySessionSchema>;

export const studyGroupUpsertSchema = studyGroupSchema.omit({ id: true, createdAt: true, updatedAt: true });

export const studySessionUpsertSchema = studySessionSchema.omit({ id: true, createdAt: true, updatedAt: true });