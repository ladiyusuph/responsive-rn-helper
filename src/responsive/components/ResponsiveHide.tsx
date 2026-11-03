import React from "react";
import { useResponsive } from "../hooks/useResponsive";
import { matchesBreakpointCondition } from "../utils";
import type { BreakpointCondition } from "../types";

/**
 * Renders children except when the current tier matches the condition
 * — the inverse of ResponsiveShow.
 * e.g. <ResponsiveHide below="medium">Sidebar-only content</ResponsiveHide>
 */
export function ResponsiveHide({
  children,
  above,
  below,
  only,
}: BreakpointCondition & { children: React.ReactNode }) {
  const { width, breakpoints } = useResponsive();

  if (matchesBreakpointCondition(width, { above, below, only }, breakpoints)) {
    return null;
  }

  return <>{children}</>;
}
