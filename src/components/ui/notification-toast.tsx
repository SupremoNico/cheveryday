"use client";

import { useEffect } from "react";
import Icon from "@/components/ui/icon";

export type AppNotification = {
  type: "success" | "error";
  message: string;
};

export default function NotificationToast({
  notification,
  onDismiss,
}: {
  notification: AppNotification | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!notification) return;
    const timeout = window.setTimeout(onDismiss, 5000);
    return () => window.clearTimeout(timeout);
  }, [notification, onDismiss]);

  if (!notification) return null;

  return (
    <div
      className={`app-notification app-notification-${notification.type}`}
      role={notification.type === "error" ? "alert" : "status"}
      aria-live={notification.type === "error" ? "assertive" : "polite"}
    >
      <Icon
        name={notification.type === "success" ? "check" : "close"}
        size={18}
      />
      <span>{notification.message}</span>
      <button
        className="app-notification-close"
        type="button"
        aria-label="Dismiss notification"
        onClick={onDismiss}
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}
