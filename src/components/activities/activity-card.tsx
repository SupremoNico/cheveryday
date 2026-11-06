"use client";

import { useState } from "react";
import { formatDate, fromDateKey } from "@/lib/dates";
import ActivityCategoryBadge from "@/components/activities/activity-category-badge";
import Icon from "@/components/ui/icon";
import type { Activity } from "@/types/activity";

export default function ActivityCard({
  activity,
  onView,
  onEdit,
  onDelete,
}: {
  activity: Activity;
  onView: (activity: Activity) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: number) => Promise<boolean>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteActivity() {
    if (isDeleting) return;
    setIsDeleting(true);
    if (!(await onDelete(activity.id))) setIsDeleting(false);
  }

  return (
    <article aria-busy={isDeleting}>
      <div className="activity-date">
        <span>{formatDate(activity.date, "MMM").toUpperCase()}</span>
        <strong>{fromDateKey(activity.date).getDate()}</strong>
      </div>
      <i className="activity-line" style={{ background: activity.color }} />
      <button
        type="button"
        className="activity-card-main"
        onClick={() => onView(activity)}
        aria-label={`View details for ${activity.title}`}
        style={{ "--activity-color": activity.color } as React.CSSProperties}
      >
        <div className="activity-details">
          <div>
            <ActivityCategoryBadge
              category={activity.category}
              color={activity.color}
            />
            <time>
              {activity.start} – {activity.end}
            </time>
          </div>
          <h3>{activity.title}</h3>
          <p>{activity.description || "No description added"}</p>
        </div>
      </button>
      <div className="row-actions">
        <button
          aria-label={`Edit ${activity.title}`}
          onClick={() => onEdit(activity)}
        >
          <Icon name="edit" />
        </button>
        <button
          aria-label={`Delete ${activity.title}`}
          disabled={isDeleting}
          onClick={deleteActivity}
        >
          <Icon name={isDeleting ? "loader" : "trash"} />
        </button>
      </div>
    </article>
  );
}
