"use client";

import { useState } from "react";
import Icon from "@/components/ui/icon";
import UserAvatar from "@/components/layout/user-avatar";
import { useAuthUser } from "@/providers/auth-user-provider";

function Setting({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="setting-row">
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <button
        className={`toggle ${checked ? "on" : ""}`}
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={onChange}
      >
        <span />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [weekends, setWeekends] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [digest, setDigest] = useState(false);
  const user = useAuthUser();
  const displayName = user.name.trim() || user.email.split("@")[0];

  return (
    <section className="settings-page">
      <div className="settings-card">
        <div className="settings-card-heading">
          <span className="settings-icon">
            <Icon name="calendar" />
          </span>
          <div>
            <h2>Calendar preferences</h2>
            <p>Choose how your calendar is displayed.</p>
          </div>
        </div>
        <Setting
          title="Show weekends"
          description="Include Saturday and Sunday in your calendar."
          checked={weekends}
          onChange={() => setWeekends((value) => !value)}
        />
      </div>
      <div className="settings-card">
        <div className="settings-card-heading">
          <span className="settings-icon">
            <Icon name="activity" />
          </span>
          <div>
            <h2>Notifications</h2>
            <p>Stay informed about your plans and progress.</p>
          </div>
        </div>
        <Setting
          title="Activity reminders"
          description="Get a reminder before an activity starts."
          checked={reminders}
          onChange={() => setReminders((value) => !value)}
        />
        <Setting
          title="Weekly digest"
          description="Receive a weekly summary of your activities."
          checked={digest}
          onChange={() => setDigest((value) => !value)}
        />
      </div>
      <div className="settings-card account-card">
        <div className="settings-card-heading">
          <UserAvatar user={user} className="account-avatar" />
          <div>
            <h2>Account details</h2>
            <p>Manage your workspace profile.</p>
          </div>
        </div>
        <div className="account-details">
          <span>Name</span>
          <strong>{displayName}</strong>
          <span>Email address</span>
          <strong>{user.email}</strong>
        </div>
      </div>
    </section>
  );
}
