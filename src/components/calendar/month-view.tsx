"use client";

import { useMemo } from "react";
import { toDateKey } from "@/lib/dates";
import CalendarGrid from "@/components/calendar/calendar-grid";
import type { Activity } from "@/types/activity";

export function MonthCalendar({
  cursor,
  selected,
  setSelected,
  activities,
  search,
  onNew,
  onViewActivity,
  onViewDay,
}: {
  cursor: Date;
  selected: string;
  setSelected: (date: string) => void;
  activities: Activity[];
  search: string;
  onNew: (date: string) => void;
  onViewActivity: (activity: Activity) => void;
  onViewDay: (date: string) => void;
}) {
  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const start = new Date(cursor.getFullYear(), cursor.getMonth(), 1 - offset);
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [cursor]);

  return (
    <CalendarGrid
      days={days}
      month={cursor.getMonth()}
      today={toDateKey(new Date())}
      selected={selected}
      activities={activities}
      search={search}
      setSelected={setSelected}
      onNew={onNew}
      onViewActivity={onViewActivity}
      onViewDay={onViewDay}
    />
  );
}

export default MonthCalendar;
