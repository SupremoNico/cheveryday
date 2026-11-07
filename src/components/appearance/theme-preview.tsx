"use client";

import { useState, type CSSProperties } from "react";
import { MONTHS } from "@/constants/categories";
import CalendarToolbar from "@/components/calendar/calendar-toolbar";
import DayView from "@/components/calendar/day-view";
import MonthView from "@/components/calendar/month-view";
import WeekView from "@/components/calendar/week-view";
import { toDateKey } from "@/lib/dates";
import type { Activity } from "@/types/activity";
import type { View } from "@/types/calendar";
import type { Theme } from "@/types/theme";

export default function ThemePreview({
  theme,
  activeTheme,
  cursor,
  selected,
  activities,
}: {
  theme: Theme;
  activeTheme: string;
  cursor: Date;
  selected: string;
  activities: Activity[];
}) {
  const [previewCursor, setPreviewCursor] = useState(cursor);
  const [previewSelected, setPreviewSelected] = useState(selected);
  const [view, setView] = useState<View>("month");
  const themeStyle = Object.fromEntries(
    Object.entries(theme).map(([key, value]) => [
      `--${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
      value,
    ]),
  ) as CSSProperties;

  function navigate(direction: number) {
    const next = new Date(previewCursor);
    if (view === "month") next.setMonth(next.getMonth() + direction);
    else if (view === "week") next.setDate(next.getDate() + 7 * direction);
    else next.setDate(next.getDate() + direction);
    setPreviewCursor(next);
    setPreviewSelected(toDateKey(next));
  }

  function goToToday() {
    const today = new Date();
    setPreviewCursor(today);
    setPreviewSelected(toDateKey(today));
  }

  return (
    <div className="preview-column">
      <div className="preview-heading">
        <div>
          <span>LIVE PREVIEW</span>
          <h2>Your calendar</h2>
        </div>
        <span>{activeTheme} theme</span>
      </div>
      <div className="appearance-preview" style={themeStyle}>
        <CalendarToolbar
          view={view}
          setView={setView}
          onNavigate={navigate}
          onToday={goToToday}
        />
        <h3 className="preview-period-title">
          {view === "day"
            ? new Intl.DateTimeFormat("en", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(previewCursor)
            : `${MONTHS[previewCursor.getMonth()]} ${previewCursor.getFullYear()}`}
        </h3>
        <div className="reference-board" inert>
          {view === "month" ? (
            <MonthView
              cursor={previewCursor}
              selected={previewSelected}
              setSelected={() => {}}
              activities={activities}
              search=""
              onNew={() => {}}
              onViewActivity={() => {}}
              onViewDay={() => {}}
            />
          ) : view === "week" ? (
            <WeekView
              cursor={previewCursor}
              selected={previewSelected}
              setSelected={() => {}}
              activities={activities}
              onNew={() => {}}
              onViewActivity={() => {}}
            />
          ) : (
            <DayView
              date={previewSelected}
              activities={activities}
              onNew={() => {}}
              onViewActivity={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
}
