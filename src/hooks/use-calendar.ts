"use client";

import usePlanner from "@/hooks/use-planner";

export function useCalendar() {
  const {
    cursor,
    selected,
    setSelected,
    view,
    setView,
    search,
    setSearch,
    navigate,
    selectMonthYear,
    goToToday,
    activities,
    activitiesLoading,
    openNew,
    setEditing,
    setViewing,
    setDayDetails,
  } = usePlanner();
  return {
    cursor,
    selected,
    setSelected,
    view,
    setView,
    search,
    setSearch,
    navigate,
    selectMonthYear,
    goToToday,
    activities,
    activitiesLoading,
    openNew,
    setEditing,
    setViewing,
    setDayDetails,
  };
}
