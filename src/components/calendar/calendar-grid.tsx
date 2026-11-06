"use client";

import { WEEKDAYS } from "@/constants/categories";
import { toDateKey } from "@/lib/dates";
import Icon from "@/components/ui/icon";
import type { Activity } from "@/types/activity";

export default function CalendarGrid({
  days,
  month,
  today,
  selected,
  activities,
  search,
  setSelected,
  onNew,
  onViewActivity,
  onViewDay,
}: {
  days: Date[];
  month: number;
  today: string;
  selected: string;
  activities: Activity[];
  search: string;
  setSelected: (date: string) => void;
  onNew: (date: string) => void;
  onViewActivity: (activity: Activity) => void;
  onViewDay: (date: string) => void;
}) {
  return (
    <div className="calendar-card">
      <div className="weekday-row">
        {WEEKDAYS.map((day, index) => (
          <div className={index > 4 ? "weekend" : ""} key={day}>
            {day}
          </div>
        ))}
      </div>
      <div className="month-grid">
        {days.map((date, index) => {
          const key = toDateKey(date);
          const dayActivities = activities.filter(
            (activity) =>
              activity.date === key &&
              activity.title.toLowerCase().includes(search.toLowerCase()),
          );
          const isToday = key === today;
          const isSelected = key === selected;

          return (
            <div
              key={key}
              className={`day-cell ${
                date.getMonth() !== month ? "outside" : ""
              } ${index % 7 > 4 ? "weekend" : ""} ${
                isSelected ? "selected" : ""
              }`}
              onClick={() => {
                setSelected(key);
                onViewDay(key);
              }}
            >
              <span className={`date-number ${isToday ? "today" : ""}`}>
                {date.getDate()}
              </span>
              <div className="day-activities">
                {dayActivities.slice(0, 3).map((activity) => (
                  <button
                    key={activity.id}
                    onClick={(event) => {
                      event.stopPropagation();
                      onViewActivity(activity);
                    }}
                    style={
                      { "--activity-color": activity.color } as React.CSSProperties
                    }
                  >
                    <i />
                    {activity.title}
                  </button>
                ))}
                {dayActivities.length > 3 && (
                  <button
                    className="more-activities"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelected(key);
                      onViewDay(key);
                    }}
                  >
                    +{dayActivities.length - 3} more
                  </button>
                )}
              </div>
              <button
                className="day-add"
                aria-label={`Add activity on ${key}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelected(key);
                  onNew(key);
                }}
              >
                <Icon name="plus" size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
