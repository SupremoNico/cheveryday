import { z } from "zod";
import { CATEGORIES } from "@/constants/categories";

const activityFieldsSchema = z.object({
  title: z.string().trim().min(1, "Enter an activity title."),
  description: z.string(),
  category: z.enum(CATEGORIES),
  date: z.iso.date("Choose a valid date."),
  start: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Choose a start time."),
  end: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Choose an end time."),
  notes: z.string(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Choose a valid color."),
});

export const activityInputSchema = activityFieldsSchema
  .refine((activity) => activity.end > activity.start, {
    path: ["end"],
    message: "End time must be later than start time.",
  });

export const activitySchema = activityFieldsSchema
  .extend({ id: z.number().int().nonnegative() })
  .refine((activity) => activity.end > activity.start, {
    path: ["end"],
    message: "End time must be later than start time.",
  });

export const persistedActivitySchema = activityFieldsSchema
  .extend({ id: z.number().int().positive() })
  .refine((activity) => activity.end > activity.start, {
    path: ["end"],
    message: "End time must be later than start time.",
  });

export const activityColorUpdatesSchema = z
  .array(
    z.object({
      id: z.number().int().positive(),
      color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    }),
  )
  .min(1);
