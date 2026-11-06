"use client";

import { formatDate, fromDateKey } from "@/lib/dates";
import Icon from "@/components/ui/icon";
import type { Activity } from "@/types/activity";

export default function DayView({
  date,
  activities,
  onNew,
  onViewActivity,
}: {
  date: string;
  activities: Activity[];
  onNew: (date?: string) => void;
  onViewActivity: (activity: Activity) => void;
}) {
  const items = activities
    .filter((activity) => activity.date === date)
    .sort((a, b) => a.start.localeCompare(b.start));

  return (
    <div className="day-view">
      <div className="day-view-title">
        <div>
          <span>{formatDate(date, "EEEE")}</span>
          <strong>{fromDateKey(date).getDate()}</strong>
        </div>
        <h2>
          {formatDate(date, "EEEE, MMMM d, yyyy")}
        </h2>
      </div>
      <div className="day-timeline">
        {items.length ? (
          items.map((activity) => (
            <button
              key={activity.id}
              className="timeline-event"
              onClick={() => onViewActivity(activity)}
            >
              <time>
                {activity.start}
                <span>{activity.end}</span>
              </time>
              <i style={{ background: activity.color }} />
              <div>
                <strong>{activity.title}</strong>
                <span>
                  {activity.category} · {activity.description}
                </span>
              </div>
              <Icon name="right" />
            </button>
          ))
        ) : (
          <div className="empty-state">
            <Icon name="calendar" size={34} />
            <h3>Your day is open</h3>
            <p>Add an activity to start planning.</p>
          </div>
        )}
      </div>
      <button className="primary-btn day-new" onClick={() => onNew(date)}>
        <Icon name="plus" /> Add activity
      </button>
    </div>
  );
}
