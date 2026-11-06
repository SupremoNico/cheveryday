import Skeleton from "@/components/ui/skeleton";

export default function AppearanceLoadingSkeleton() {
  return (
    <div
      className="appearance-loading"
      role="status"
      aria-label="Loading appearance"
    >
      <div className="appearance-loading-controls" aria-hidden="true">
        <Skeleton className="appearance-loading-heading" />
        <Skeleton className="appearance-loading-description" />
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="appearance-loading-theme" />
        ))}
      </div>
      <div className="appearance-loading-preview" aria-hidden="true">
        <Skeleton className="appearance-loading-preview-heading" />
        <div className="appearance-loading-calendar">
          {Array.from({ length: 35 }, (_, index) => (
            <Skeleton key={index} className="appearance-loading-cell" />
          ))}
        </div>
        <Skeleton className="appearance-loading-button" />
      </div>
    </div>
  );
}
