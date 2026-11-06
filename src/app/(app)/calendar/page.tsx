"use client";

import CalendarPage from "@/components/calendar/calendar-page";
import CalendarLoadingSkeleton from "@/components/calendar/calendar-loading-skeleton";
import { useCalendar } from "@/hooks/use-calendar";

export default function CalendarRoute() {
  const {
    cursor,
    selected,
    setSelected,
    activities,
    activitiesLoading,
    view,
    setView,
    search,
    navigate,
    goToToday,
    openNew,
    setViewing,
    setDayDetails,
  } = useCalendar();

  if (activitiesLoading) {
    return <CalendarLoadingSkeleton />;
  }

  return (
    <CalendarPage
      cursor={cursor}
      selected={selected}
      setSelected={setSelected}
      activities={activities}
      view={view}
      setView={setView}
      search={search}
      onNavigate={navigate}
      onToday={goToToday}
      onNew={openNew}
      onViewActivity={setViewing}
      onViewDay={setDayDetails}
    />
  );
}
