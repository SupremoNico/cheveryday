"use client";

import Link from "next/link";
import Icon, { type IconName } from "@/components/ui/icon";
import UserAvatar from "@/components/layout/user-avatar";
import BrandLogo from "@/components/ui/brand-logo";
import type { Page } from "@/types/calendar";

const navigation: {
  href: string;
  page: Page;
  icon: IconName;
  label: string;
}[] = [
  { href: "/calendar", page: "calendar", icon: "calendar", label: "Calendar" },
  {
    href: "/activities",
    page: "activities",
    icon: "activity",
    label: "My Activities",
  },
  {
    href: "/appearance",
    page: "appearance",
    icon: "palette",
    label: "Appearance",
  },
  { href: "/settings", page: "settings", icon: "settings", label: "Settings" },
];

export default function AppSidebar({
  currentPage,
  activityCount,
  user,
  open,
  onNavigate,
}: {
  currentPage: Page;
  activityCount: number;
  user: { name: string; email: string; image?: string | null };
  open: boolean;
  onNavigate: () => void;
}) {
  const displayName = user.name.trim() || user.email.split("@")[0];

  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <Link
        href="/calendar"
        className="brand sidebar-brand"
        onClick={onNavigate}
      >
        <BrandLogo className="brand-mark" />
        <span className="brand-wordmark">Cheveryday</span>
      </Link>
      <nav aria-label="Workspace">
        <p>WORKSPACE</p>
        {navigation.map((item) => (
          <Link
            key={item.page}
            href={item.href}
            className={currentPage === item.page ? "active" : ""}
            aria-current={currentPage === item.page ? "page" : undefined}
            onClick={onNavigate}
          >
            <Icon name={item.icon} />
            <span>
              {item.label}
              {item.page === "activities" && (
                <span className="nav-count">{activityCount}</span>
              )}
            </span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="user">
          <UserAvatar user={user} className="avatar" />
          <div>
            <strong>{displayName}</strong>
            <span>{user.email}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
