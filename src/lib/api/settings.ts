import { appSettingsSchema } from "@/lib/validations/settings.schema";
import type { AppSettings, AppSettingsUpdate } from "@/types/settings";

export async function persistSettings(
  settings: AppSettingsUpdate,
): Promise<AppSettings> {
  const response = await fetch("/api/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });

  const result: unknown = await response.json();
  if (!response.ok) {
    const message =
      result &&
      typeof result === "object" &&
      "error" in result &&
      typeof result.error === "string"
        ? result.error
        : "Could not save settings.";
    throw new Error(message);
  }

  const parsed = appSettingsSchema.safeParse(result);
  if (!parsed.success) {
    throw new Error("The server returned invalid settings.");
  }

  return parsed.data;
}
