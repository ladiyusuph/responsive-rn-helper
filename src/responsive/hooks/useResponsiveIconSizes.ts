import { useMemo } from "react";
import { useResponsiveConfig } from "../context/ResponsiveProvider";
import { useResponsive } from "./useResponsive";
import { computeIconSizeTokens } from "../utils";

/**
 * Access responsive icon-size tokens directly, without pulling in the rest
 * of useLayout()'s spacing/radii/typography bundle.
 *
 * ```tsx
 * const icons = useResponsiveIconSizes();
 * icons.md;
 * icons.lg;
 * ```
 */
export function useResponsiveIconSizes() {
  const { layout } = useResponsiveConfig();
  const { width, deviceType, breakpoints } = useResponsive();

  // Tokens only change when the tier does, so key on deviceType, not width.
  return useMemo(
    () => computeIconSizeTokens(width, layout.iconSize, breakpoints),
    [deviceType, layout.iconSize, breakpoints],
  );
}
