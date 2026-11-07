import Skeleton from "@/components/ui/skeleton";

export default function LoginLoadingSkeleton() {
  return (
    <main className="login-loading-screen" role="status" aria-label="Loading sign in">
      <div className="login-loading-content">
        <div className="login-loading-brand">
          <Skeleton className="login-loading-logo" />
          <div>
            <Skeleton className="login-loading-wordmark" />
            <Skeleton className="login-loading-tagline" />
          </div>
        </div>
        <Skeleton className="login-loading-heading" />
        <Skeleton className="login-loading-copy" />
        <Skeleton className="login-loading-button" />
        <Skeleton className="login-loading-footnote" />
      </div>
      <div className="login-loading-art">
        <Skeleton className="login-loading-art-heading" />
        <Skeleton className="login-loading-calendar" />
      </div>
    </main>
  );
}
