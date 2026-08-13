import { useResponsiveConfig } from "../context/ResponsiveProvider";
import { useResponsiveValue } from "./useResponsiveValue";

export function useResponsiveTypography() {
  const { typography } = useResponsiveConfig();
  return {
    xxs: useResponsiveValue(typography.xxs, 9),
    xs: useResponsiveValue(typography.xs, 10),
    sm: useResponsiveValue(typography.sm, 12),
    md: useResponsiveValue(typography.md, 14),
    lg: useResponsiveValue(typography.lg, 16),
    xl: useResponsiveValue(typography.xl, 18),
    xxl: useResponsiveValue(typography.xxl, 20),
    "2xl": useResponsiveValue(typography["2xl"], 22),
    "3xl": useResponsiveValue(typography["3xl"], 26),
  };
}
