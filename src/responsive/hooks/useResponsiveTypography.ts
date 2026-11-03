import { useMemo } from "react";
import { useResponsiveConfig } from "../context/ResponsiveProvider";
import { useResponsive } from "./useResponsive";
import { computeTypographyTokens } from "../utils";

export function useResponsiveTypography() {
  const { typography } = useResponsiveConfig();
  const { width, deviceType, breakpoints } = useResponsive();

  // Tokens only change when the tier does, so key on deviceType, not width.
  return useMemo(
    () => computeTypographyTokens(width, typography, breakpoints),
    [deviceType, typography, breakpoints],
  );
}
