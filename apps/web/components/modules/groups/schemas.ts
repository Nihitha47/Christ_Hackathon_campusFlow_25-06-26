import { z } from "zod";
import { studyGroupUpsertSchema, studySessionUpsertSchema } from "@campusflow/shared";

export const createGroupFormSchema = studyGroupUpsertSchema.extend({
  ownerProfileId: z.string().uuid("Owner profile ID must be a valid UUID")
});

export type CreateGroupFormValues = z.infer<typeof createGroupFormSchema>;

export const addMemberFormSchema = z.object({
  profileId: z.string().uuid("Member profile ID must be a valid UUID"),
  role: z.enum(["owner", "member"]).default("member")
});

export type AddMemberFormValues = z.infer<typeof addMemberFormSchema>;

export const createSessionFormSchema = studySessionUpsertSchema;

export type CreateSessionFormValues = z.infer<typeof createSessionFormSchema>;