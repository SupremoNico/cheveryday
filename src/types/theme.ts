export type ThemeColor =
  | "calendarBg"
  | "cellBg"
  | "headerBg"
  | "border"
  | "weekdayText"
  | "dateText"
  | "today"
  | "selected"
  | "weekendBg"
  | "weekendText"
  | "activityBg"
  | "activityText"
  | "activityBorder"
  | "inputBg"
  | "inputText"
  | "inputBorder"
  | "placeholder"
  | "focus"
  | "textareaBg"
  | "dropdownBg"
  | "dropdownSelected"
  | "primaryBg"
  | "primaryText"
  | "secondaryBg"
  | "secondaryText"
  | "buttonHover"
  | "buttonBorder"
  | "work"
  | "personal"
  | "study"
  | "business"
  | "meeting"
  | "other";

export type Theme = Record<ThemeColor, string>;

export type UserTheme = {
  name: string;
  theme: Theme;
};

export type CategoryColor = Extract<
  ThemeColor,
  "work" | "personal" | "study" | "business" | "meeting" | "other"
>;
