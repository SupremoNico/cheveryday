"use client";

import ActivityCard from "@/components/activities/activity-card";
import Icon from "@/components/ui/icon";
import Skeleton from "@/components/ui/skeleton";
import type { Activity } from "@/types/activity";

export default function ActivityList({
  activities,
  totalActivities,
  isFiltered,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onClearFilters,
  onNew,
}: {
  activities: Activity[];
  totalActivities: number;
  isFiltered: boolean;
  isLoading: boolean;
  onView: (activity: Activity) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: number) => Promise<boolean>;
  onClearFilters: () => void;
  onNew: () => void;
}) {
  return (
    <div className="activity-list">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      {isLoading && (
        <div className="activity-list-loading" role="status" aria-label="Loading activities">
          {Array.from({ length: 4 }, (_, index) => (
            <article className="activity-skeleton-row" key={index} aria-hidden="true">
              <Skeleton className="activity-skeleton-date" />
              <Skeleton className="activity-skeleton-line" />
              <div className="activity-skeleton-details">
                <Skeleton className="activity-skeleton-meta" />
                <Skeleton className="activity-skeleton-title" />
                <Skeleton className="activity-skeleton-copy" />
              </div>
              <Skeleton className="activity-skeleton-action" />
            </article>
          ))}
        </div>
      )}
      {!isLoading && !activities.length && (
        <div className="empty-state">
          <Icon name="search" size={34} />
          <h3>
            {totalActivities === 0 ? "No activities yet" : "No activities found"}
          </h3>
          <p>
            {totalActivities === 0
              ? "Add your first activity to start planning."
              : "Try adjusting your filters."}
          </p>
          {totalActivities > 0 && isFiltered ? (
            <button className="secondary-btn" onClick={onClearFilters}>
              Clear filters
            </button>
          ) : (
            <button className="primary-btn" onClick={onNew}>
              Add activity
            </button>
          )}
        </div>
      )}
    </div>
  );
}
