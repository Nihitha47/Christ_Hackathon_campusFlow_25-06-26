import { z } from "zod";

export const idSchema = z.string().min(1);

// Accepts full ISO strings (from API) AND datetime-local browser input (YYYY-MM-DDTHH:MM)
export const isoDateTimeSchema = z
  .string()
  .min(1, "Date is required")
  .transform((val) => {
    // If already a full ISO with offset, keep as-is
    if (val.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(val)) return val;
    // datetime-local format — convert to UTC ISO
    const d = new Date(val);
    if (isNaN(d.getTime())) throw new Error("Invalid datetime");
    return d.toISOString();
  });

export const phoneSchema = z
  .string()
  .min(8)
  .max(20)
  .regex(/^[+\d][\d\s()-]+$/, "Enter a valid phone number");

export const branchSchema = z.string().min(2).max(120);

export const subjectSchema = z.string().min(1).max(120);