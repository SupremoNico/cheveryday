import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AppShell from "@/components/layout/app-shell";
import AppLoadingSkeleton from "@/components/layout/app-loading-skeleton";
import { getAuth } from "@/lib/auth";
import { PlannerProvider } from "@/providers/planner-provider";
import SettingsProvider from "@/providers/settings-provider";
import { getUserSettings } from "@/services/settings.service";
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

  const [initialTheme, initialSettings] = await Promise.all([
    getUserTheme(session.user.id),
    getUserSettings(session.user.id),
  ]);

  return (
    <PlannerProvider initialTheme={initialTheme}>
      <SettingsProvider
        key={session.user.id}
        initialSettings={initialSettings}
      >
        <AppShell
          user={{
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          }}
        >
          {children}
        </AppShell>
      </SettingsProvider>
    </PlannerProvider>
  );
}
