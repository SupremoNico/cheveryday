import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import { updateAppSettingsSchema } from "@/lib/validations/settings.schema";
import { updateUserSettings } from "@/services/settings.service";

async function getUserId() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  return session?.user.id ?? null;
}

function handleError(error: unknown) {
  console.error("Settings API request failed.", error);
  return Response.json(
    {
      error:
        process.env.NODE_ENV === "development" && error instanceof Error
          ? error.message
          : "Could not process settings.",
    },
    { status: 500 },
  );
}

export async function PATCH(request: Request) {
  const userId = await getUserId();
  if (!userId) return Response.json({ error: "Unauthorized." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsed = updateAppSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid settings." },
      { status: 400 },
    );
  }

  try {
    return Response.json(await updateUserSettings(userId, parsed.data));
  } catch (error) {
    return handleError(error);
  }
}
