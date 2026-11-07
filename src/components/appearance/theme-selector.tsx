"use client";

import { DEFAULT_THEME, THEME_PRESETS } from "@/constants/themes";
import Icon from "@/components/ui/icon";
import ThemeCard from "@/components/appearance/theme-card";

export default function ThemeSelector({
  activeTheme,
  saving,
  onSelect,
}: {
  activeTheme: string;
  saving: boolean;
  onSelect: (name: string) => void;
}) {
  return (
    <div className="appearance-controls simple-theme-picker">
      <div className="simple-theme-heading">
        <span>THEMES</span>
        <h2>Choose your look</h2>
        <p>Select a theme to apply it to your workspace.</p>
      </div>
      <div className="simple-theme-list">
        {Object.entries(THEME_PRESETS).map(([name, values]) => (
          <ThemeCard
            key={name}
            name={name}
            theme={{ ...DEFAULT_THEME, ...values }}
            active={activeTheme === name}
            isSaving={saving && activeTheme === name}
            disabled={saving || activeTheme === name}
            onSelect={() => onSelect(name)}
          />
        ))}
      </div>
      <div className="simple-theme-note">
        <Icon name="palette" size={17} />
        <span>
          Theme colors update across your calendar, activities, and controls.
        </span>
      </div>
    </div>
  );
}
