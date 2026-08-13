import { useResponsiveConfig } from "../context/ResponsiveProvider";
import { useResponsiveValue } from "./useResponsiveValue";

export function useResponsiveRadii() {
  const { radii } = useResponsiveConfig();
  return {
    sm: useResponsiveValue(radii.sm, 8),
    md: useResponsiveValue(radii.md, 12),
    lg: useResponsiveValue(radii.lg, 16),
    xl: useResponsiveValue(radii.xl, 20),
    xxl: useResponsiveValue(radii.xxl, 24),
  };
}
