import {
  Activity,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LoaderCircle,
  Menu,
  Palette,
  Plus,
  Search,
  Settings,
  Trash2,
  X,
  Pencil,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export type IconName =
  | "calendar"
  | "activity"
  | "palette"
  | "settings"
  | "search"
  | "plus"
  | "left"
  | "right"
  | "close"
  | "trash"
  | "edit"
  | "logout"
  | "check"
  | "chevron"
  | "menu"
  | "loader";

const icons: Record<
  IconName,
  ComponentType<SVGProps<SVGSVGElement> & { size?: string | number }>
> = {
  calendar: CalendarDays,
  activity: Activity,
  palette: Palette,
  settings: Settings,
  search: Search,
  plus: Plus,
  left: ChevronLeft,
  right: ChevronRight,
  close: X,
  trash: Trash2,
  edit: Pencil,
  logout: LogOut,
  check: Check,
  chevron: ChevronDown,
  menu: Menu,
  loader: LoaderCircle,
};

export default function Icon({
  name,
  size = 19,
  ...props
}: {
  name: IconName;
  size?: number;
} & SVGProps<SVGSVGElement>) {
  const IconComponent = icons[name];
  return (
    <IconComponent
      aria-hidden="true"
      className={name === "loader" ? "loading-icon" : undefined}
      width={size}
      height={size}
      strokeWidth={1.8}
      {...props}
    />
  );
}
