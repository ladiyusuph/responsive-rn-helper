import { useMemo } from "react";
import { useResponsiveConfig } from "../context/ResponsiveProvider";
import { useResponsive } from "./useResponsive";
import { computeRadiiTokens } from "../utils";

export function useResponsiveRadii() {
  const { radii } = useResponsiveConfig();
  const { width, deviceType, breakpoints } = useResponsive();

  // Tokens only change when the tier does, so key on deviceType, not width.
  return useMemo(
    () => computeRadiiTokens(width, radii, breakpoints),
    [deviceType, radii, breakpoints],
  );
}
