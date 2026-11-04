"use client";

import Icon from "@/components/ui/icon";
import type { Theme } from "@/types/theme";

export default function ThemeCard({
  name,
  theme,
  active,
  isSaving,
  disabled = false,
  onSelect,
}: {
  name: string;
  theme: Theme;
  active: boolean;
  isSaving: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={active ? "active" : ""}
      aria-pressed={active}
      aria-busy={isSaving}
      disabled={disabled}
      onClick={onSelect}
    >
      <span className="theme-swatch">
        <i style={{ background: theme.primaryBg }} />
        <i style={{ background: theme.selected }} />
        <i style={{ background: theme.activityBg }} />
      </span>
      <span className="theme-name">
        <strong>{name}</strong>
        <small>
          {name === "Default" ? "Clean and balanced" : `${name} workspace`}
        </small>
      </span>
      {(isSaving || active) && (
        <span className="theme-status-badge" aria-live="polite">
          {isSaving ? (
            <>
              <Icon name="loader" size={14} />
              Saving
            </>
          ) : (
            "Active"
          )}
        </span>
      )}
    </button>
  );
}
