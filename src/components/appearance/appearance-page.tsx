"use client";

import { DEFAULT_THEME, THEME_PRESETS } from "@/constants/themes";
import ThemePreview from "@/components/appearance/theme-preview";
import ThemeSelector from "@/components/appearance/theme-selector";
import type { Activity } from "@/types/activity";
import type { Theme } from "@/types/theme";

export default function AppearancePage({
  theme,
  activeTheme,
  isSaving,
  setTheme,
  cursor,
  selected,
  activities,
}: {
  theme: Theme;
  activeTheme: string;
  isSaving: boolean;
  setTheme: (name: string, theme: Theme) => void;
  cursor: Date;
  selected: string;
  activities: Activity[];
}) {
  function chooseTheme(name: string) {
    setTheme(name, { ...DEFAULT_THEME, ...THEME_PRESETS[name] });
  }

  return (
    <section className="appearance-page">
      <div className="appearance-layout">
        <div className="appearance-controls">
          <ThemeSelector
            activeTheme={activeTheme}
            saving={isSaving}
            onSelect={chooseTheme}
          />
        </div>
        <ThemePreview
          theme={theme}
          activeTheme={activeTheme}
          cursor={cursor}
          selected={selected}
          activities={activities}
        />
      </div>
    </section>
  );
}
