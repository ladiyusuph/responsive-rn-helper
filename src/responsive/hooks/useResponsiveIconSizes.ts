import { useResponsiveConfig } from "../context/ResponsiveProvider";
import { useResponsiveValue } from "./useResponsiveValue";

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

  return {
    xs: useResponsiveValue(layout.iconSize.xs, 14),
    sm: useResponsiveValue(layout.iconSize.sm, 18),
    md: useResponsiveValue(layout.iconSize.md, 22),
    lg: useResponsiveValue(layout.iconSize.lg, 26),
    xl: useResponsiveValue(layout.iconSize.xl, 30),
  };
}
