"use client";

import usePlanner from "@/hooks/use-planner";

export function useTheme() {
  const { theme, activeTheme, themeSaving, applyTheme } = usePlanner();
  return { theme, activeTheme, themeSaving, applyTheme };
}
