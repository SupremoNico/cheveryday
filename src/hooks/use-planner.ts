"use client";

import { useContext } from "react";
import { PlannerContext } from "@/providers/planner-provider";

export default function usePlanner() {
  const value = useContext(PlannerContext);
  if (!value) {
    throw new Error("usePlanner must be used within PlannerProvider");
  }
  return value;
}
