import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AppShell from "@/components/layout/app-shell";
import AppLoadingSkeleton from "@/components/layout/app-loading-skeleton";
import { getAuth } from "@/lib/auth";
import { PlannerProvider } from "@/providers/planner-provider";
import { getUserTheme } from "@/services/theme.service";

export default function PlannerLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<AppLoadingSkeleton />}>
      <AuthenticatedPlanner>{children}</AuthenticatedPlanner>
    </Suspense>
  );
}

async function AuthenticatedPlanner({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });

  if (!session) {
    redirect("/login");
  }

  const initialTheme = await getUserTheme(session.user.id);

  return (
    <PlannerProvider key={session.user.id} initialTheme={initialTheme}>
      <AppShell
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }}
      >
        {children}
      </AppShell>
    </PlannerProvider>
  );
}
