"use client";

import Icon from "@/components/ui/icon";
import type { View } from "@/types/calendar";

export default function CalendarToolbar({
  view,
  setView,
  onNavigate,
  onToday,
}: {
  view: View;
  setView: (view: View) => void;
  onNavigate: (direction: number) => void;
  onToday: () => void;
}) {
  return (
    <div className="calendar-toolbar">
      <div className="date-navigation">
        <button className="secondary-btn" onClick={onToday}>
          Today
        </button>
        <button
          className="icon-btn"
          aria-label="Previous period"
          onClick={() => onNavigate(-1)}
        >
          <Icon name="left" />
        </button>
        <button
          className="icon-btn"
          aria-label="Next period"
          onClick={() => onNavigate(1)}
        >
          <Icon name="right" />
        </button>
      </div>
      <div className="view-switch" aria-label="Calendar view">
        {(["month", "week", "day"] as View[]).map((value) => (
          <button
            key={value}
            className={view === value ? "active" : ""}
            aria-pressed={view === value}
            onClick={() => setView(value)}
          >
            {value[0].toUpperCase() + value.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
