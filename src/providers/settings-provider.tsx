"use client";

import {
  createContext,
  useCallback,
  useState,
  type ReactNode,
} from "react";
import { persistSettings } from "@/lib/api/settings";
import usePlanner from "@/hooks/use-planner";
import type { AppSettings } from "@/types/settings";

const settingLabels: Record<keyof AppSettings, string> = {
  allowWeekendActivityCreation: "Weekend activity creation",
  reminders: "Activity reminders",
  weeklyDigest: "Weekly digest",
};

type SettingsContextValue = {
  settings: AppSettings;
  isSaving: boolean;
  error: string | null;
  updateSetting: (key: keyof AppSettings, value: boolean) => Promise<void>;
};

export const SettingsContext = createContext<SettingsContextValue | null>(null);

export default function SettingsProvider({
  children,
  initialSettings,
}: {
  children: ReactNode;
  initialSettings: AppSettings;
}) {
  const { showNotification } = usePlanner();
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSetting = useCallback(
    async (key: keyof AppSettings, value: boolean) => {
      const previousSettings = settings;
      setSettings({ ...settings, [key]: value });
      setIsSaving(true);
      setError(null);

      try {
        setSettings(await persistSettings({ [key]: value }));
        showNotification({
          type: "success",
          message: `${settingLabels[key]} ${value ? "enabled" : "disabled"}.`,
        });
      } catch (saveError) {
        console.error("Could not save settings.", saveError);
        setSettings(previousSettings);
        setError(
          saveError instanceof Error
            ? saveError.message
            : "Could not save settings.",
        );
      } finally {
        setIsSaving(false);
      }
    },
    [settings, showNotification],
  );

  return (
    <SettingsContext.Provider
      value={{ settings, isSaving, error, updateSetting }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
