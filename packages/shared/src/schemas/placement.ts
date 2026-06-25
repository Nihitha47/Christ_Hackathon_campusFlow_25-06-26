import { z } from "zod";
import { isoDateTimeSchema } from "./common";

export const placementTypeValues = ["company", "assessment", "mock-interview", "resource"] as const;

export const placementItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(2).max(160),
  notes: z.string().max(1000).optional().default(""),
  type: z.enum(placementTypeValues),
  dueAt: isoDateTimeSchema.optional(),
  reminderAt: isoDateTimeSchema.optional(),
  addToCalendar: z.boolean().default(false),
  createdAt: isoDateTimeSchema.optional(),
  updatedAt: isoDateTimeSchema.optional()
});

export type PlacementItemRecord = z.infer<typeof placementItemSchema>;

export const placementItemUpsertSchema = placementItemSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type PlacementItemUpsertInput = z.infer<typeof placementItemUpsertSchema>;