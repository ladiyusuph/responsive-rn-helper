import { useMemo } from "react";
import { useResponsiveConfig } from "../context/ResponsiveProvider";
import { useResponsive } from "./useResponsive";
import { computeSpacingTokens } from "../utils";

export function useResponsiveSpacing() {
  const { spacing } = useResponsiveConfig();
  const { width, deviceType, breakpoints } = useResponsive();

  // Tokens only change when the tier does, so key on deviceType, not width.
  return useMemo(
    () => computeSpacingTokens(width, spacing, breakpoints),
    [deviceType, spacing, breakpoints],
  );
}
