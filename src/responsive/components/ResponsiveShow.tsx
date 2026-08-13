import React from "react";
import { useResponsive } from "../hooks/useResponsive";
import { matchesBreakpointCondition } from "../utils";
import type { BreakpointCondition } from "../types";

/**
 * Renders children only when the current deviceType matches the condition.
 * e.g. <ResponsiveShow above="tablet">...</ResponsiveShow>
 *      <ResponsiveShow only={["phone", "small-phone"]}>...</ResponsiveShow>
 */
export function ResponsiveShow({
  children,
  above,
  below,
  only,
}: BreakpointCondition & { children: React.ReactNode }) {
  const { deviceType } = useResponsive();

  if (!matchesBreakpointCondition(deviceType, { above, below, only })) {
    return null;
  }

  return <>{children}</>;
}
