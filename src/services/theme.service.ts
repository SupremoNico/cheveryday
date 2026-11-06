import "server-only";

import { DEFAULT_THEME, THEME_PRESETS } from "@/constants/themes";
import { prisma } from "@/lib/prisma";
import { themeNameSchema } from "@/lib/validations/theme.schema";
import type { Theme } from "@/types/theme";

export async function getUserTheme(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { themeName: true },
  });
  const parsedName = themeNameSchema.safeParse(user.themeName);
  const name = parsedName.success ? parsedName.data : "Default";
  const theme: Theme = { ...DEFAULT_THEME, ...THEME_PRESETS[name] };

  return { name, theme };
}

export async function updateUserTheme(userId: string, name: string) {
  const parsedName = themeNameSchema.parse(name);
  await prisma.user.update({
    where: { id: userId },
    data: { themeName: parsedName },
  });

  return getUserTheme(userId);
}
