import "server-only";

import type { Activity as PrismaActivity } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { Activity } from "@/types/activity";

type ActivityInput = Omit<Activity, "id">;

function toActivity(record: PrismaActivity): Activity {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    category: record.category,
    date: record.date.toISOString().slice(0, 10),
    start: record.start,
    end: record.end,
    notes: record.notes,
    color: record.color,
  };
}

function toActivityData(activity: ActivityInput) {
  return {
    ...activity,
    date: new Date(`${activity.date}T00:00:00.000Z`),
  };
}

export async function listActivities(userId: string): Promise<Activity[]> {
  const records = await prisma.activity.findMany({
    where: { userId },
    orderBy: [{ date: "asc" }, { start: "asc" }],
  });
  return records.map(toActivity);
}

export async function createActivity(
  userId: string,
  activity: ActivityInput,
): Promise<Activity> {
  const record = await prisma.activity.create({
    data: { ...toActivityData(activity), userId },
  });
  return toActivity(record);
}

export async function updateActivity(
  userId: string,
  id: number,
  activity: ActivityInput,
): Promise<Activity | null> {
  const result = await prisma.activity.updateMany({
    where: { id, userId },
    data: toActivityData(activity),
  });
  if (!result.count) return null;

  const record = await prisma.activity.findFirst({ where: { id, userId } });
  return record ? toActivity(record) : null;
}

export async function deleteActivity(
  userId: string,
  id: number,
): Promise<boolean> {
  const result = await prisma.activity.deleteMany({ where: { id, userId } });
  return result.count > 0;
}

export async function updateActivityColors(
  userId: string,
  updates: { id: number; color: string }[],
): Promise<boolean> {
  return prisma.$transaction(async (transaction) => {
    const records = await transaction.activity.findMany({
      where: { userId, id: { in: updates.map(({ id }) => id) } },
      select: { id: true },
    });

    if (records.length !== updates.length) return false;

    await Promise.all(
      updates.map(({ id, color }) =>
        transaction.activity.update({ where: { id }, data: { color } }),
      ),
    );
    return true;
  });
}
