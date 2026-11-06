import type { Category } from "@/types/activity";

export const CATEGORIES = [
  "Work",
  "Personal",
  "Study",
  "Business",
  "Meeting",
  "Other",
] as const satisfies readonly Category[];

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
