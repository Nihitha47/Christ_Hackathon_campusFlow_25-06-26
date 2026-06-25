import { z } from "zod";
import { branchSchema, phoneSchema } from "./common";

const yearSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]);

export const onboardingSchema = z.object({
  name: z.string().min(2).max(120),
  branch: branchSchema,
  year: yearSchema,
  subjects: z.array(z.string().min(2).max(120)).min(1),
  phoneNumber: phoneSchema,
  googleEmail: z.string().email()
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export const profileSchema = onboardingSchema.extend({
  id: z.string().min(1),
  createdAt: z.string().datetime({ offset: true }).optional(),
  updatedAt: z.string().datetime({ offset: true }).optional()
});

export type ProfileRecord = z.infer<typeof profileSchema>;