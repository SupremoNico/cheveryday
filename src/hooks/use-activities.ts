"use client";

import usePlanner from "@/hooks/use-planner";

export function useActivities() {
  const {
    activities,
    activitiesLoading,
    setEditing,
    setViewing,
    deleteActivity,
    openNew,
    saveActivity,
  } = usePlanner();
  return {
    activities,
    activitiesLoading,
    setEditing,
    setViewing,
    deleteActivity,
    openNew,
    saveActivity,
  };
}
