"use client";

import { WEEKDAYS } from "@/constants/categories";
import { toDateKey } from "@/lib/dates";
import type { Activity } from "@/types/activity";

export default function WeekView({
  cursor,
  selected,
  setSelected,
  activities,
  onNew,
  onViewActivity,
}: {
  cursor: Date;
  selected: string;
  setSelected: (date: string) => void;
  activities: Activity[];
  onNew: (date?: string) => void;
  onViewActivity: (activity: Activity) => void;
}) {
  const monday = new Date(cursor);
  monday.setDate(cursor.getDate() - ((cursor.getDay() + 6) % 7));
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });

  return (
    <div className="week-card">
      <div className="week-head">
        <div />
        {days.map((date) => {
          const key = toDateKey(date);
          return (
            <button
              key={key}
              className={key === selected ? "selected" : ""}
              onClick={() => setSelected(key)}
            >
              <span>{WEEKDAYS[(date.getDay() + 6) % 7]}</span>
              <b>{date.getDate()}</b>
            </button>
          );
        })}
      </div>
      <div className="week-body">
        <div className="time-col">
          {["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"].map((time) => (
            <span key={time}>{time}</span>
          ))}
        </div>
        {days.map((date) => {
          const key = toDateKey(date);
          return (
            <div key={key} className="week-day" onClick={() => onNew(key)}>
              {activities
                .filter((activity) => activity.date === key)
                .map((activity, index) => (
                  <button
                    key={activity.id}
                    className="week-event"
                    style={
                      {
                        "--activity-color": activity.color,
                        top: `${10 + index * 80}px`,
                      } as React.CSSProperties
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                      onViewActivity(activity);
                    }}
                  >
                    <b>{activity.start}</b>
                    {activity.title}
                  </button>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
