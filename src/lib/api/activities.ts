import { z } from "zod";
import {
  activityColorUpdatesSchema,
  activityInputSchema,
  persistedActivitySchema,
} from "@/lib/validations/activity.schema";
import type { Activity } from "@/types/activity";

export const activitiesQueryKey = ["activities"] as const;

async function getError(response: Response, fallback: string) {
  const result = (await response.json().catch(() => null)) as
    | { error?: string }
    | null;
  return new Error(result?.error ?? fallback);
}

export async function fetchActivities({
  signal,
}: {
  signal?: AbortSignal;
} = {}): Promise<Activity[]> {
  const response = await fetch("/api/activities", { signal });
  if (!response.ok) {
    throw await getError(response, "Could not load activities. Please try again.");
  }
  return z.array(persistedActivitySchema).parse(await response.json());
}

export async function persistActivity(
  activity: Activity,
): Promise<Activity> {
  const input = activityInputSchema.parse(activity);
  const response = await fetch(
    activity.id ? `/api/activities/${activity.id}` : "/api/activities",
    {
      method: activity.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );
  if (!response.ok) {
    throw await getError(response, "Could not save activity. Try again.");
  }
  return persistedActivitySchema.parse(await response.json());
}

export async function removeActivity(id: number): Promise<number> {
  const response = await fetch(`/api/activities/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw await getError(response, "Could not delete activity. Try again.");
  }
  return id;
}

export async function persistActivityColors(
  updates: { id: number; color: string }[],
): Promise<{ id: number; color: string }[]> {
  const input = activityColorUpdatesSchema.parse(updates);
  const response = await fetch("/api/activities", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw await getError(response, "Could not update activity colors.");
  }
  return input;
}
