import { z } from "zod";
import { THEME_PRESETS } from "@/constants/themes";

export const themeNameSchema = z.string().refine(
  (name) => Object.hasOwn(THEME_PRESETS, name),
  "Choose a valid theme.",
);

export const updateThemeSchema = z.object({
  name: themeNameSchema,
});
