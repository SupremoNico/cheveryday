"use client";

import CalendarLegend from "@/components/calendar/calendar-legend";
import CalendarToolbar from "@/components/calendar/calendar-toolbar";
import DayView from "@/components/calendar/day-view";
import MonthView from "@/components/calendar/month-view";
import WeekView from "@/components/calendar/week-view";
import { useAppSettings } from "@/hooks/use-settings";
import type { Activity } from "@/types/activity";
import type { View } from "@/types/calendar";

export default function CalendarPage({
  cursor,
  selected,
  setSelected,
  activities,
  view,
  setView,
  search,
  onNavigate,
  onToday,
  onNew,
  onViewActivity,
  onViewDay,
}: {
  cursor: Date;
  selected: string;
  setSelected: (date: string) => void;
  activities: Activity[];
  view: View;
  setView: (view: View) => void;
  search: string;
  onNavigate: (direction: number) => void;
  onToday: () => void;
  onNew: (date?: string) => void;
  onViewActivity: (activity: Activity) => void;
  onViewDay: (date: string) => void;
}) {
  const { settings } = useAppSettings();

  return (
    <div className="calendar-page">
      <CalendarToolbar
        view={view}
        setView={setView}
        onNavigate={onNavigate}
        onToday={onToday}
      />
      {view === "month" ? (
        <MonthView
          cursor={cursor}
          selected={selected}
          setSelected={setSelected}
          activities={activities}
          search={search}
          onNew={onNew}
          onViewActivity={onViewActivity}
          onViewDay={onViewDay}
          allowWeekendActivityCreation={
            settings.allowWeekendActivityCreation
          }
        />
      ) : view === "week" ? (
        <WeekView
          cursor={cursor}
          selected={selected}
          setSelected={setSelected}
          activities={activities}
          onNew={onNew}
          onViewActivity={onViewActivity}
          allowWeekendActivityCreation={
            settings.allowWeekendActivityCreation
          }
        />
      ) : (
        <DayView
          date={selected}
          activities={activities}
          onNew={onNew}
          onViewActivity={onViewActivity}
        />
      )}
      <CalendarLegend />
    </div>
  );
}
