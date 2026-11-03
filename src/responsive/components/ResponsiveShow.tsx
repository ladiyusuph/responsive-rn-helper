import React from "react";
import { useResponsive } from "../hooks/useResponsive";
import { matchesBreakpointCondition } from "../utils";
import type { BreakpointCondition } from "../types";

/**
 * Renders children only when the current tier matches the condition.
 * e.g. <ResponsiveShow above="expanded">...</ResponsiveShow>
 *      <ResponsiveShow only={["compact", "medium"]}>...</ResponsiveShow>
 */
export function ResponsiveShow({
  children,
  above,
  below,
  only,
}: BreakpointCondition & { children: React.ReactNode }) {
  const { width, breakpoints } = useResponsive();

  if (!matchesBreakpointCondition(width, { above, below, only }, breakpoints)) {
    return null;
  }

  return <>{children}</>;
}
