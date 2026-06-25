import { z } from "zod";
import { isoDateTimeSchema, subjectSchema } from "./common";

export const taskPriorityValues = ["low", "medium", "high"] as const;

export const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(2).max(160),
  description: z.string().max(500).optional().default(""),
  subject: subjectSchema.optional().default(""),
  dueAt: isoDateTimeSchema,
  reminderAt: z.union([isoDateTimeSchema, z.literal(""), z.null()]).optional(),
  addToCalendar: z.boolean().default(false),
  priority: z.enum(taskPriorityValues),
  completed: z.boolean().default(false),
  createdAt: isoDateTimeSchema.optional(),
  updatedAt: isoDateTimeSchema.optional()
});

export type TaskRecord = z.infer<typeof taskSchema>;

export const taskUpsertSchema = taskSchema.omit({ id: true, createdAt: true, updatedAt: true, completed: true });

export type TaskUpsertInput = z.infer<typeof taskUpsertSchema>;