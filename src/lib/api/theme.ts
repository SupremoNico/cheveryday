import { z } from "zod";
import { DEFAULT_THEME, THEME_PRESETS } from "@/constants/themes";
import { themeNameSchema } from "@/lib/validations/theme.schema";
import type { Theme } from "@/types/theme";

const userThemeSchema = z.object({
  name: themeNameSchema,
  theme: z.record(z.string(), z.string()),
});

export async function persistUserTheme(
  name: string,
): Promise<{ name: string; theme: Theme }> {
  const response = await fetch("/api/theme", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(result?.error ?? "Could not save theme preference.");
  }

  const result = userThemeSchema.parse(await response.json());
  return {
    name: result.name,
    theme: { ...DEFAULT_THEME, ...THEME_PRESETS[result.name], ...result.theme },
  };
}
