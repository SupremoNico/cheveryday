import { format, parseISO } from "date-fns";
import type { Category } from "@/types/activity";
import type { CategoryColor } from "@/types/theme";

export function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromDateKey(key: string) {
  return parseISO(key);
}

export function formatDate(key: string, pattern: string) {
  return format(fromDateKey(key), pattern);
}

const categoryColorKeys: Record<Category, CategoryColor> = {
  Work: "work",
  Personal: "personal",
  Study: "study",
  Business: "business",
  Meeting: "meeting",
  Other: "other",
};

export function categoryColorKey(category: Category): CategoryColor {
  return categoryColorKeys[category];
}
