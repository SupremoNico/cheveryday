"use client";

import { useContext } from "react";
import { SettingsContext } from "@/providers/settings-provider";

export function useAppSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used within SettingsProvider.");
  }
  return context;
}
