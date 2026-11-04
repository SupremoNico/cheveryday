"use client";

import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import CalendarDatePicker from "@/components/calendar/calendar-date-picker";
import SignOutButton from "@/components/auth/sign-out-button";
import UserAvatar from "@/components/layout/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AppHeader({
  title,
  subtitle,
  cursor,
  onSelectMonthYear,
  showCalendarActions,
  search,
  onSearchChange,
  onOpenMenu,
  user,
}: {
  title: string;
  subtitle: string;
  cursor: Date;
  onSelectMonthYear: (year: number, month: number) => void;
  showCalendarActions: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onOpenMenu: () => void;
  user: { name: string; email: string; image?: string | null };
}) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu"
          aria-label="Open menu"
          onClick={onOpenMenu}
        >
          <Icon name="menu" />
        </button>
        <div>
          {showCalendarActions ? (
            <CalendarDatePicker
              date={cursor}
              onSelect={onSelectMonthYear}
            />
          ) : (
            <h1>{title}</h1>
          )}
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <div className="topbar-actions">
        {showCalendarActions && (
          <div className="search-box">
            <Icon name="search" size={17} />
            <Input
              className="search-input"
              aria-label="Search calendar activities"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search activities"
            />
            <kbd>⌘ K</kbd>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="top-avatar" aria-label="Open profile menu">
              <UserAvatar user={user} className="profile-avatar" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="profile-menu-panel"
            aria-label="Profile menu"
          >
            <div className="profile-menu-user">
              <div>
                <strong>{user.name.trim() || user.email.split("@")[0]}</strong>
                <span>{user.email}</span>
              </div>
            </div>
            <SignOutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
