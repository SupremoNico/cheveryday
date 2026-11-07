import Skeleton from "@/components/ui/skeleton";

export default function CalendarLoadingSkeleton() {
  return (
    <div className="calendar-loading" role="status" aria-label="Loading calendar">
      <div className="calendar-loading-toolbar" aria-hidden="true">
        <Skeleton className="calendar-loading-control" />
        <Skeleton className="calendar-loading-control calendar-loading-control-short" />
      </div>
      <div className="calendar-loading-card" aria-hidden="true">
        <div className="calendar-loading-weekdays">
          {Array.from({ length: 7 }, (_, index) => (
            <Skeleton key={index} className="calendar-loading-weekday" />
          ))}
        </div>
        <div className="calendar-loading-days">
          {Array.from({ length: 42 }, (_, index) => (
            <div className="calendar-loading-day" key={index}>
              <Skeleton className="calendar-loading-day-number" />
              {index % 3 === 0 && (
                <Skeleton className="calendar-loading-event" />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="calendar-loading-legend" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="calendar-loading-legend-item" />
        ))}
      </div>
    </div>
  );
}
