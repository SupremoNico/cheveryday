"use client";

import { createContext, useContext, type ReactNode } from "react";

const ThemePortalContext = createContext<HTMLElement | null>(null);

export function ThemePortalProvider({
  container,
  children,
}: {
  container: HTMLElement | null;
  children: ReactNode;
}) {
  return (
    <ThemePortalContext.Provider value={container}>
      {children}
    </ThemePortalContext.Provider>
  );
}

export function useThemePortalContainer() {
  return useContext(ThemePortalContext);
}
