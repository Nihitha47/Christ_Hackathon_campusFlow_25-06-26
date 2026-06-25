import { z } from "zod";
import { onboardingSchema } from "./profile";

export const registerRequestSchema = onboardingSchema.extend({
  password: z.string().min(8).max(128)
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const loginRequestSchema = z.object({
  googleEmail: z.string().email(),
  password: z.string().min(8).max(128)
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const authSessionSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().optional(),
  profileId: z.string().min(1)
});

export type AuthSession = z.infer<typeof authSessionSchema>;