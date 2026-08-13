import React from "react";
import { useResponsive } from "../hooks/useResponsive";
import { matchesBreakpointCondition } from "../utils";
import type { BreakpointCondition } from "../types";

/**
 * Renders children except when the current deviceType matches the condition
 * — the inverse of ResponsiveShow.
 * e.g. <ResponsiveHide below="tablet">Sidebar-only content</ResponsiveHide>
 */
export function ResponsiveHide({
  children,
  above,
  below,
  only,
}: BreakpointCondition & { children: React.ReactNode }) {
  const { deviceType } = useResponsive();

  if (matchesBreakpointCondition(deviceType, { above, below, only })) {
    return null;
  }

  return <>{children}</>;
}
