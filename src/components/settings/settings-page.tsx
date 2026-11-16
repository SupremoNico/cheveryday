"use client";

import Icon from "@/components/ui/icon";
import UserAvatar from "@/components/layout/user-avatar";
import { useAppSettings } from "@/hooks/use-settings";
import { useAuthUser } from "@/providers/auth-user-provider";

function Setting({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="setting-row">
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <button
        type="button"
        className={`toggle ${checked ? "on" : ""}`}
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        onClick={onChange}
      >
        <span />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { settings, isSaving, error, updateSetting } = useAppSettings();
  const user = useAuthUser();
  const displayName = user.name?.trim() || user.email?.split("@")[0] || "Your account";

  return (
    <section className="settings-page">
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
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
          title="Allow weekend activity creation"
          description="Weekend activities stay visible. Turn this off to prevent creating new ones on Saturday and Sunday."
          checked={settings.allowWeekendActivityCreation}
          disabled={isSaving}
          onChange={() =>
            updateSetting(
              "allowWeekendActivityCreation",
              !settings.allowWeekendActivityCreation,
            )
          }
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
          checked={settings.reminders}
          disabled={isSaving}
          onChange={() => updateSetting("reminders", !settings.reminders)}
        />
        <Setting
          title="Weekly digest"
          description="Receive a weekly summary of your activities."
          checked={settings.weeklyDigest}
          disabled={isSaving}
          onChange={() => updateSetting("weeklyDigest", !settings.weeklyDigest)}
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
