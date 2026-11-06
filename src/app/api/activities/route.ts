import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import {
  activityColorUpdatesSchema,
  activityInputSchema,
} from "@/lib/validations/activity.schema";
import {
  createActivity,
  listActivities,
  updateActivityColors,
} from "@/services/activity.service";

async function getUserId() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  return session?.user.id ?? null;
}

function handleError(error: unknown) {
  console.error("Activity API request failed.", error);
  return Response.json(
    {
      error:
        process.env.NODE_ENV === "development" && error instanceof Error
          ? error.message
          : "Could not process activities.",
    },
    { status: 500 },
  );
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return Response.json({ error: "Unauthorized." }, { status: 401 });

  try {
    return Response.json(await listActivities(userId));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return Response.json({ error: "Unauthorized." }, { status: 401 });

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
    return Response.json(await createActivity(userId, parsed.data), { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request) {
  const userId = await getUserId();
  if (!userId) return Response.json({ error: "Unauthorized." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = activityColorUpdatesSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid activity color updates." }, { status: 400 });
  }

  try {
    const updated = await updateActivityColors(userId, parsed.data);
    if (!updated) {
      return Response.json({ error: "One or more activities were not found." }, { status: 404 });
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
