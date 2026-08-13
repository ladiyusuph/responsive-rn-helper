import { useResponsiveConfig } from "../context/ResponsiveProvider";
import { useResponsiveValue } from "./useResponsiveValue";

export function useResponsiveSpacing() {
  const { spacing } = useResponsiveConfig();
  return {
    screen: useResponsiveValue(spacing.screen, 16),
    section: useResponsiveValue(spacing.section, 20),
    card: useResponsiveValue(spacing.card, 16),
    gap: useResponsiveValue(spacing.gap, 12),
  };
}
