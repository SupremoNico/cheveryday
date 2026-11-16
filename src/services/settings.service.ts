import "server-only";

import { prisma } from "@/lib/prisma";
import type { AppSettings, AppSettingsUpdate } from "@/types/settings";

const settingsSelect = {
  allowWeekendActivityCreation: true,
  activityReminders: true,
  weeklyDigest: true,
} as const;

function toAppSettings(user: {
  allowWeekendActivityCreation: boolean;
  activityReminders: boolean;
  weeklyDigest: boolean;
}): AppSettings {
  return {
    allowWeekendActivityCreation: user.allowWeekendActivityCreation,
    reminders: user.activityReminders,
    weeklyDigest: user.weeklyDigest,
  };
}

export async function getUserSettings(userId: string): Promise<AppSettings> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: settingsSelect,
  });

  return toAppSettings(user);
}

export async function updateUserSettings(
  userId: string,
  settings: AppSettingsUpdate,
): Promise<AppSettings> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(settings.allowWeekendActivityCreation !== undefined && {
        allowWeekendActivityCreation: settings.allowWeekendActivityCreation,
      }),
      ...(settings.reminders !== undefined && {
        activityReminders: settings.reminders,
      }),
      ...(settings.weeklyDigest !== undefined && {
        weeklyDigest: settings.weeklyDigest,
      }),
    },
    select: settingsSelect,
  });

  return toAppSettings(user);
}
