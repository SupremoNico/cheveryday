"use client";

import { useState, type MouseEvent } from "react";
import { formatDate, fromDateKey } from "@/lib/dates";
import ActivityCategoryBadge from "@/components/activities/activity-category-badge";
import Icon from "@/components/ui/icon";
import type { Activity } from "@/types/activity";

export default function DayActivitiesPanel({
  date,
  activities,
  onClose,
  onNew,
  onEdit,
  onView,
  onDelete,
}: {
  date: string;
  activities: Activity[];
  onClose: () => void;
  onNew: () => void;
  onEdit: (activity: Activity) => void;
  onView: (activity: Activity) => void;
  onDelete: (id: number) => Promise<boolean>;
}) {
  const sorted = [...activities].sort((a, b) => a.start.localeCompare(b.start));
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function deleteActivity(id: number) {
    if (deletingId !== null) return;
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  }

  return (
    <div
      className="panel-overlay day-list-overlay"
      onMouseDown={onClose}
      role="presentation"
    >
      <section
        className="day-list-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="day-list-title"
        aria-busy={deletingId !== null}
        onMouseDown={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}
      >
        <div className="day-list-header">
          <div className="day-list-date">
            <span>{formatDate(date, "MMM")}</span>
            <strong>{fromDateKey(date).getDate()}</strong>
          </div>
          <div>
            <p>DAILY ACTIVITIES</p>
            <h2 id="day-list-title">
              {formatDate(date, "EEEE, MMMM d")}
            </h2>
            <span>
              {sorted.length} {sorted.length === 1 ? "activity" : "activities"}{" "}
              planned
            </span>
          </div>
          <button
            className="icon-btn"
            onClick={onClose}
            aria-label="Close day details"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="day-list-content">
          {sorted.length ? (
            sorted.map((activity) => (
              <article className="day-list-item" key={activity.id}>
                <div className="day-list-time">
                  <strong>{activity.start}</strong>
                  <span>{activity.end}</span>
                </div>
                <i style={{ background: activity.color }} />
                <button
                  type="button"
                  className="day-list-copy day-list-copy-button"
                  onClick={() => onView(activity)}
                  aria-label={`View details for ${activity.title}`}
                  style={
                    { "--activity-color": activity.color } as React.CSSProperties
                  }
                >
                  <div>
                    <ActivityCategoryBadge
                      category={activity.category}
                      color={activity.color}
                    />
                  </div>
                  <h3>{activity.title}</h3>
                  <p>{activity.description || "No description added"}</p>
                </button>
                <div className="row-actions">
                  <button
                    aria-label={`Edit ${activity.title}`}
                    onClick={() => onEdit(activity)}
                  >
                    <Icon name="edit" size={17} />
                  </button>
                  <button
                    aria-label={`Delete ${activity.title}`}
                    disabled={deletingId !== null}
                    onClick={() => deleteActivity(activity.id)}
                  >
                    <Icon
                      name={deletingId === activity.id ? "loader" : "trash"}
                      size={17}
                    />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <Icon name="calendar" size={34} />
              <h3>No activities yet</h3>
              <p>This day is open and ready to plan.</p>
            </div>
          )}
        </div>
        <div className="day-list-footer">
          <span>
            {sorted.length > 3
              ? `All ${sorted.length} activities are shown`
              : "Everything planned for this day"}
          </span>
          <button className="primary-btn" onClick={onNew}>
            <Icon name="plus" size={17} /> Add activity
          </button>
        </div>
      </section>
    </div>
  );
}
