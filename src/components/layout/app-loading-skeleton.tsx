import Skeleton from "@/components/ui/skeleton";

export default function AppLoadingSkeleton() {
  return (
    <main className="app-loading-screen" role="status" aria-label="Loading page">
      <aside className="app-loading-sidebar">
        <div className="app-loading-brand">
          <Skeleton className="app-loading-logo" />
          <Skeleton className="app-loading-brand-text" />
        </div>
        <Skeleton className="app-loading-nav-item" />
        <Skeleton className="app-loading-nav-item" />
        <Skeleton className="app-loading-nav-item" />
        <Skeleton className="app-loading-nav-item" />
      </aside>
      <section className="app-loading-main">
        <header className="app-loading-header">
          <div>
            <Skeleton className="app-loading-title" />
            <Skeleton className="app-loading-subtitle" />
          </div>
          <Skeleton className="app-loading-avatar" />
        </header>
        <div className="app-loading-content">
          <div className="app-loading-toolbar">
            <Skeleton className="app-loading-control" />
            <Skeleton className="app-loading-control app-loading-control-short" />
          </div>
          <div className="app-loading-calendar">
            {Array.from({ length: 42 }, (_, index) => (
              <Skeleton key={index} className="app-loading-calendar-cell" />
            ))}
          </div>
          <div className="app-loading-footer">
            <Skeleton className="app-loading-control" />
            <Skeleton className="app-loading-control" />
            <Skeleton className="app-loading-control" />
          </div>
        </div>
      </section>
    </main>
  );
}
