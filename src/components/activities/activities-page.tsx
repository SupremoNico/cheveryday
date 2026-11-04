"use client";

import { useState } from "react";
import ActivityFilters from "@/components/activities/activity-filters";
import ActivityList from "@/components/activities/activity-list";
import type { Activity } from "@/types/activity";

export default function ActivitiesPage({
  activities,
  onEdit,
  onView,
  onDelete,
  onNew,
  isLoading,
}: {
  activities: Activity[];
  isLoading: boolean;
  onEdit: (activity: Activity) => void;
  onView: (activity: Activity) => void;
  onDelete: (id: number) => Promise<boolean>;
  onNew: () => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [date, setDate] = useState("");
  const filtered = activities
    .filter(
      (activity) =>
        (category === "All" || activity.category === category) &&
        (!date || activity.date === date) &&
        `${activity.title} ${activity.description}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  function clearFilters() {
    setQuery("");
    setCategory("All");
    setDate("");
  }

  return (
    <section className="activities-page">
      <ActivityFilters
        query={query}
        category={category}
        date={date}
        onQueryChange={setQuery}
        onCategoryChange={setCategory}
        onDateChange={setDate}
        onAdd={onNew}
      />
      <div className="activity-list-header">
        <span>
          {filtered.length} {filtered.length === 1 ? "activity" : "activities"}
        </span>
        <button onClick={clearFilters}>Clear filters</button>
      </div>
      <ActivityList
        activities={filtered}
        totalActivities={activities.length}
        isFiltered={Boolean(query || date || category !== "All")}
        isLoading={isLoading}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onClearFilters={clearFilters}
        onNew={onNew}
      />
    </section>
  );
}
