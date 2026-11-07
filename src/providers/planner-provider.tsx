"use client";

import {
  createContext,
  useCallback,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toDateKey } from "@/lib/dates";
import {
  activitiesQueryKey,
  fetchActivities,
  persistActivity,
  removeActivity,
} from "@/lib/api/activities";
import { persistUserTheme } from "@/lib/api/theme";
import type { AppNotification } from "@/components/ui/notification-toast";
import type { Activity } from "@/types/activity";
import type { View } from "@/types/calendar";
import type { Theme, UserTheme } from "@/types/theme";

type SaveActivityOptions = {
  silent?: boolean;
};

export type PlannerContextValue = {
  activities: Activity[];
  activitiesLoading: boolean;
  activityError: string | null;
  mutationError: string | null;
  notification: AppNotification | null;
  dismissNotification: () => void;
  cursor: Date;
  selected: string;
  view: View;
  search: string;
  theme: Theme;
  activeTheme: string;
  themeSaving: boolean;
  viewing: Activity | null;
  editing: Activity | null | undefined;
  dayDetails: string | undefined;
  setSelected: Dispatch<SetStateAction<string>>;
  setView: Dispatch<SetStateAction<View>>;
  setSearch: Dispatch<SetStateAction<string>>;
  setEditing: Dispatch<SetStateAction<Activity | null | undefined>>;
  setViewing: Dispatch<SetStateAction<Activity | null>>;
  setDayDetails: Dispatch<SetStateAction<string | undefined>>;
  navigate: (direction: number) => void;
  selectMonthYear: (year: number, month: number) => void;
  goToToday: () => void;
  openNew: (date?: string) => void;
  saveActivity: (
    activity: Activity,
    options?: SaveActivityOptions,
  ) => Promise<boolean>;
  deleteActivity: (id: number) => Promise<boolean>;
  applyTheme: (name: string, theme: Theme) => void;
};

export const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme: UserTheme;
}) {
  const queryClient = useQueryClient();

  const [mutationError, setMutationError] = useState<string | null>(null);
  const [notification, setNotification] = useState<AppNotification | null>(
    null,
  );

  const dismissNotification = useCallback(() => setNotification(null), []);

  const [initialDate] = useState(() => new Date());
  const [cursor, setCursor] = useState(initialDate);
  const [selected, setSelected] = useState(toDateKey(initialDate));
  const [view, setView] = useState<View>("month");
  const [search, setSearch] = useState("");

  const [editing, setEditing] = useState<Activity | null | undefined>();
  const [viewing, setViewing] = useState<Activity | null>(null);
  const [dayDetails, setDayDetails] = useState<string>();

  const activitiesQuery = useQuery({
    queryKey: activitiesQueryKey,
    queryFn: fetchActivities,
  });

  const [theme, setTheme] = useState(initialTheme.theme);
  const [activeTheme, setActiveTheme] = useState(initialTheme.name);

  const activities = activitiesQuery.data ?? [];
  const activitiesLoading = activitiesQuery.isPending;

  const activityError =
    activitiesQuery.error instanceof Error
      ? activitiesQuery.error.message
      : null;

  const saveMutation = useMutation({
    mutationFn: ({ activity }: { activity: Activity; silent: boolean }) =>
      persistActivity(activity),

    onSuccess: async (savedActivity, variables) => {
      queryClient.setQueryData<Activity[]>(
        activitiesQueryKey,
        (current = []) =>
          variables.activity.id
            ? current.map((activity) =>
                activity.id === savedActivity.id ? savedActivity : activity,
              )
            : [...current, savedActivity],
      );

      // Keep the details panel synchronized with the saved activity.
      setViewing((current) =>
        current?.id === savedActivity.id ? savedActivity : current,
      );

      // Only close the editor for normal form saves.
      if (!variables.silent) {
        setEditing(undefined);
      }

      setMutationError(null);

      // Checklist saves should not show a success toast.
      if (!variables.silent) {
        setNotification({
          type: "success",
          message: variables.activity.id
            ? "Activity updated."
            : "Activity created.",
        });
      }

      await queryClient.invalidateQueries({
        queryKey: activitiesQueryKey,
      });
    },

    onError: (error) => {
      console.error("Could not save activity.", error);

      const message =
        error instanceof Error ? error.message : "Could not save activity.";

      setMutationError(message);
      setNotification({
        type: "error",
        message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: removeActivity,

    onSuccess: async (id) => {
      queryClient.setQueryData<Activity[]>(activitiesQueryKey, (current = []) =>
        current.filter((activity) => activity.id !== id),
      );

      setViewing((current) => (current?.id === id ? null : current));

      setEditing(undefined);
      setMutationError(null);

      setNotification({
        type: "success",
        message: "Activity deleted.",
      });

      await queryClient.invalidateQueries({
        queryKey: activitiesQueryKey,
      });
    },

    onError: (error) => {
      console.error("Could not delete activity.", error);

      const message =
        error instanceof Error ? error.message : "Could not delete activity.";

      setMutationError(message);
      setNotification({
        type: "error",
        message,
      });
    },
  });

  const themeMutation = useMutation({
    mutationFn: ({ name }: { name: string; theme: Theme }) =>
      persistUserTheme(name),

    onMutate: ({ name, theme: nextTheme }) => {
      const previous = {
        name: activeTheme,
        theme,
      };

      setActiveTheme(name);
      setTheme(nextTheme);

      return previous;
    },

    onError: (error, _variables, context) => {
      console.error("Could not save theme preference.", error);

      if (context) {
        setActiveTheme(context.name);
        setTheme(context.theme);
      }

      const message =
        error instanceof Error
          ? error.message
          : "Could not save theme preference.";

      setMutationError(message);
      setNotification({
        type: "error",
        message,
      });
    },

    onSuccess: (savedTheme) => {
      setActiveTheme(savedTheme.name);
      setTheme(savedTheme.theme);
      setMutationError(null);

      setNotification({
        type: "success",
        message: `${savedTheme.name} theme applied.`,
      });
    },
  });

  function navigate(direction: number) {
    const next = new Date(cursor);

    if (view === "month") {
      next.setMonth(next.getMonth() + direction);
    } else if (view === "week") {
      next.setDate(next.getDate() + 7 * direction);
    } else {
      next.setDate(next.getDate() + direction);
    }

    setCursor(next);
    setSelected(toDateKey(next));
  }

  function selectMonthYear(year: number, month: number) {
    const selectedDay = Math.min(
      cursor.getDate(),
      new Date(year, month + 1, 0).getDate(),
    );

    const next = new Date(year, month, selectedDay);

    setCursor(next);
    setSelected(toDateKey(next));
  }

  function goToToday() {
    const today = new Date();

    setCursor(today);
    setSelected(toDateKey(today));
  }

  function openNew(date = selected) {
    setViewing(null);

    setEditing({
      id: 0,
      title: "",
      description: "",
      category: "Work",
      date,
      start: "09:00",
      end: "10:00",
      notes: "",
      color: theme.work,
    });
  }

  async function saveActivity(
    activity: Activity,
    options: SaveActivityOptions = {},
  ): Promise<boolean> {
    setMutationError(null);

    try {
      await saveMutation.mutateAsync({
        activity,
        silent: options.silent ?? false,
      });

      return true;
    } catch {
      return false;
    }
  }

  async function deleteActivity(id: number): Promise<boolean> {
    setMutationError(null);

    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  }

  function applyTheme(name: string, nextTheme: Theme) {
    setMutationError(null);
    themeMutation.mutate({ name, theme: nextTheme });
  }

  const value: PlannerContextValue = {
    activities,
    activitiesLoading,
    activityError,
    mutationError,
    notification,
    dismissNotification,
    cursor,
    selected,
    view,
    search,
    theme,
    activeTheme,
    themeSaving: themeMutation.isPending,
    viewing,
    editing,
    dayDetails,
    setSelected,
    setView,
    setSearch,
    setEditing,
    setViewing,
    setDayDetails,
    navigate,
    selectMonthYear,
    goToToday,
    openNew,
    saveActivity,
    deleteActivity,
    applyTheme,
  };

  return (
    <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
  );
}
