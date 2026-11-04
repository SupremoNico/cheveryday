"use client";

import type { MouseEvent } from "react";
import ActivityCategoryBadge from "@/components/activities/activity-category-badge";
import Icon from "@/components/ui/icon";
import { formatDate } from "@/lib/dates";
import type { Activity } from "@/types/activity";

export default function ActivityDetailsPanel({
  activity,
  onClose,
  onEdit,
}: {
  activity: Activity;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <div
      className="panel-overlay activity-details-overlay"
      onMouseDown={onClose}
      role="presentation"
    >
      <section
        className="activity-details-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-details-title"
        onMouseDown={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}
      >
        <header className="activity-details-header">
          <div className="activity-details-heading">
            <ActivityCategoryBadge
              category={activity.category}
              color={activity.color}
            />
            <h2 id="activity-details-title">{activity.title}</h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close activity details"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </header>
        <div className="activity-details-content">
          <div className="activity-details-color" style={{ background: activity.color }} />
          <dl className="activity-details-fields">
            <div>
              <dt>Date</dt>
              <dd>{formatDate(activity.date, "EEEE, MMMM d, yyyy")}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>
                {activity.start} – {activity.end}
              </dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>{activity.description || "No description added"}</dd>
            </div>
            <div>
              <dt>Notes and accomplishments</dt>
              <dd>{activity.notes || "No notes added"}</dd>
            </div>
          </dl>
        </div>
        <footer className="activity-details-footer">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Close
          </button>
          <button type="button" className="primary-btn" onClick={onEdit}>
            <Icon name="edit" size={16} />
            Edit activity
          </button>
        </footer>
      </section>
    </div>
  );
}
