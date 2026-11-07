"use client";

import { usePathname } from "next/navigation";
import { useState, type CSSProperties, type ReactNode } from "react";
import { MONTHS } from "@/constants/categories";
import ActivityPanel from "@/components/activities/activity-panel";
import ActivityDetailsPanel from "@/components/activities/activity-details-panel";
import DayActivitiesPanel from "@/components/calendar/day-activities-panel";
import AppHeader from "@/components/layout/app-header";
import AppSidebar from "@/components/layout/app-sidebar";
import MobileNavigation from "@/components/layout/mobile-navigation";
import { AuthUserProvider } from "@/providers/auth-user-provider";
import usePlanner from "@/hooks/use-planner";
import { ThemePortalProvider } from "@/components/ui/theme-portal";
import NotificationToast from "@/components/ui/notification-toast";
import type { Page } from "@/types/calendar";

export default function AppShell({
  children,
  user,
}: {
  children: ReactNode;
  user: { name: string; email: string; image?: string | null };
}) {
  const pathname = usePathname();
  const [mobileNav, setMobileNav] = useState(false);
  const [themeContainer, setThemeContainer] = useState<HTMLDivElement | null>(
    null,
  );
  const {
    activities,
    activityError,
    mutationError,
    notification,
    dismissNotification,
    cursor,
    selectMonthYear,
    search,
    setSearch,
    theme,
    editing,
    setEditing,
    viewing,
    setViewing,
    dayDetails,
    setDayDetails,
    openNew,
    saveActivity,
    deleteActivity,
  } = usePlanner();
  const currentPage: Page = pathname.startsWith("/activities")
    ? "activities"
    : pathname.startsWith("/appearance")
      ? "appearance"
      : pathname.startsWith("/settings")
        ? "settings"
        : "calendar";
  const title =
    currentPage === "calendar"
      ? `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`
      : currentPage === "activities"
        ? "My Activities"
        : currentPage === "appearance"
          ? "Appearance"
          : "Settings";
  const subtitle =
    currentPage === "activities"
      ? "A complete record of your time and progress."
      : currentPage === "appearance"
        ? "Make your workspace feel like yours."
        : currentPage === "settings"
          ? "Manage your workspace preferences."
          : "";
  const style = Object.fromEntries(
    Object.entries(theme).map(([key, value]) => [
      `--${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
      value,
    ]),
  ) as CSSProperties;

  return (
    <ThemePortalProvider container={themeContainer}>
      <div className="app-theme" ref={setThemeContainer} style={style}>
        <div className="app">
          <AppSidebar
            currentPage={currentPage}
            activityCount={activities.length}
            user={user}
            open={mobileNav}
            onNavigate={() => setMobileNav(false)}
          />
          <MobileNavigation
            open={mobileNav}
            onClose={() => setMobileNav(false)}
          />
          <main className="main">
            <AppHeader
              title={title}
              subtitle={subtitle}
              cursor={cursor}
              onSelectMonthYear={selectMonthYear}
              showCalendarActions={currentPage === "calendar"}
              search={search}
              onSearchChange={setSearch}
              onOpenMenu={() => setMobileNav(true)}
              user={user}
            />
            <div className="content">
              {activityError && (
                <p className="auth-error" role="alert">
                  {activityError}
                </p>
              )}
              <AuthUserProvider user={user}>{children}</AuthUserProvider>
            </div>
          </main>
        </div>
        {dayDetails && editing === undefined && (
          <DayActivitiesPanel
            date={dayDetails}
            activities={activities.filter(
              (activity) => activity.date === dayDetails,
            )}
            onClose={() => setDayDetails(undefined)}
            onNew={() => {
              const date = dayDetails;
              setDayDetails(undefined);
              openNew(date);
            }}
            onEdit={(activity) => {
              setDayDetails(undefined);
              setEditing(activity);
            }}
            onView={(activity) => {
              setDayDetails(undefined);
              setViewing(activity);
            }}
            onDelete={deleteActivity}
          />
        )}
        {viewing && (
          <ActivityDetailsPanel
            activity={viewing}
            onClose={() => setViewing(null)}
            onEdit={() => {
              setEditing(viewing);
              setViewing(null);
            }}
            onSave={(activity) => saveActivity(activity, { silent: true })}
          />
        )}
        {editing !== undefined && editing !== null && (
          <ActivityPanel
            key={editing.id || "new"}
            activity={editing}
            theme={theme}
            onClose={() => setEditing(undefined)}
            onSave={saveActivity}
            onDelete={deleteActivity}
            errorMessage={mutationError ?? activityError}
          />
        )}
        <NotificationToast
          notification={notification}
          onDismiss={dismissNotification}
        />
      </div>
    </ThemePortalProvider>
  );
}
