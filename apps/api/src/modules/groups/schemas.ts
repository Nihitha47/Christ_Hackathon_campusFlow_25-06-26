import { z } from "zod";
import { studyGroupUpsertSchema, studySessionUpsertSchema } from "@campusflow/shared";

export const createStudyGroupSchema = studyGroupUpsertSchema.extend({
  ownerProfileId: z.string().uuid(),
  memberIds: z.array(z.string().uuid()).optional()
});

export const updateStudyGroupSchema = studyGroupUpsertSchema.partial();

export const addStudyGroupMemberSchema = z.object({
  profileId: z.string().uuid(),
  role: z.enum(["owner", "member"]).default("member")
});

export const createStudySessionSchema = studySessionUpsertSchema.extend({
  scheduledAt: z.string().datetime({ offset: true })
});

export const updateStudySessionSchema = createStudySessionSchema.partial();