"use client";

import AppearancePage from "@/components/appearance/appearance-page";
import AppearanceLoadingSkeleton from "@/components/appearance/appearance-loading-skeleton";
import { useCalendar } from "@/hooks/use-calendar";
import { useTheme } from "@/hooks/use-theme";

export default function AppearanceRoute() {
  const {
    cursor,
    selected,
    activities,
    activitiesLoading,
  } = useCalendar();
  const { theme, activeTheme, themeSaving, applyTheme } = useTheme();

  if (activitiesLoading) return <AppearanceLoadingSkeleton />;
  return (
    <AppearancePage
      theme={theme}
      activeTheme={activeTheme}
      isSaving={themeSaving}
      setTheme={applyTheme}
      cursor={cursor}
      selected={selected}
      activities={activities}
    />
  );
}
