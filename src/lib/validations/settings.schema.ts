import { z } from "zod";

export const appSettingsSchema = z.object({
  allowWeekendActivityCreation: z.boolean(),
  reminders: z.boolean(),
  weeklyDigest: z.boolean(),
});

export const updateAppSettingsSchema = appSettingsSchema
  .partial()
  .strict()
  .refine((settings) => Object.keys(settings).length > 0, {
    message: "Choose at least one setting to update.",
  });
