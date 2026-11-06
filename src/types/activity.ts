export type Category =
  | "Work"
  | "Personal"
  | "Study"
  | "Business"
  | "Meeting"
  | "Other";

export type Activity = {
  id: number;
  title: string;
  description: string;
  category: Category;
  date: string;
  start: string;
  end: string;
  notes: string;
  color: string;
};
