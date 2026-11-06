import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import { activityInputSchema } from "@/lib/validations/activity.schema";
import {
  deleteActivity,
  updateActivity,
} from "@/services/activity.service";

async function getUserId() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  return session?.user.id ?? null;
}

function parseId(value: string) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function handleError(error: unknown) {
  console.error("Activity API request failed.", error);
  return Response.json(
    {
      error:
        process.env.NODE_ENV === "development" && error instanceof Error
          ? error.message
          : "Could not process activity.",
    },
    { status: 500 },
  );
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const userId = await getUserId();
  if (!userId) return Response.json({ error: "Unauthorized." }, { status: 401 });

  const id = parseId((await context.params).id);
  if (!id) return Response.json({ error: "Invalid activity ID." }, { status: 400 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = activityInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid activity." },
      { status: 400 },
    );
  }

  try {
    const activity = await updateActivity(userId, id, parsed.data);
    if (!activity) return Response.json({ error: "Activity not found." }, { status: 404 });
    return Response.json(activity);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const userId = await getUserId();
  if (!userId) return Response.json({ error: "Unauthorized." }, { status: 401 });

  const id = parseId((await context.params).id);
  if (!id) return Response.json({ error: "Invalid activity ID." }, { status: 400 });

  try {
    const deleted = await deleteActivity(userId, id);
    if (!deleted) return Response.json({ error: "Activity not found." }, { status: 404 });
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
