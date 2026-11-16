export type AppSettings = {
  allowWeekendActivityCreation: boolean;
  reminders: boolean;
  weeklyDigest: boolean;
};

export type AppSettingsUpdate = Partial<AppSettings>;

export const DEFAULT_APP_SETTINGS: AppSettings = {
  allowWeekendActivityCreation: true,
  reminders: true,
  weeklyDigest: false,
};
