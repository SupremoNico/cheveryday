"use client";

import ActivitiesPage from "@/components/activities/activities-page";
import { useActivities } from "@/hooks/use-activities";

export default function ActivitiesRoute() {
  const {
    activities,
    activitiesLoading,
    setEditing,
    setViewing,
    deleteActivity,
    openNew,
  } = useActivities();

  return (
    <ActivitiesPage
      activities={activities}
      isLoading={activitiesLoading}
      onEdit={setEditing}
      onView={setViewing}
      onDelete={deleteActivity}
      onNew={() => openNew()}
    />
  );
}
