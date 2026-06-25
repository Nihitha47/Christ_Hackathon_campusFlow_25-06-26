import { z } from "zod";

export const idSchema = z.string().min(1);

export const isoDateTimeSchema = z.string().datetime({ offset: true });

export const phoneSchema = z
  .string()
  .min(8)
  .max(20)
  .regex(/^[+\d][\d\s()-]+$/, "Enter a valid phone number");

export const branchSchema = z.string().min(2).max(120);

export const subjectSchema = z.string().min(2).max(120);