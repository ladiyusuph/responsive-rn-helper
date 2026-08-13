import { useResponsiveValue } from "./useResponsiveValue";

export function useResponsiveSpacing() {
  return {
    screen: useResponsiveValue({ small: 12, phone: 16, tablet: 24, largeTablet: 32 }, 16),
    section: useResponsiveValue({ small: 16, phone: 20, tablet: 24, largeTablet: 32 }, 20),
    card: useResponsiveValue({ small: 12, phone: 16, tablet: 20, largeTablet: 24 }, 16),
    gap: useResponsiveValue({ small: 8, phone: 12, tablet: 16, largeTablet: 20 }, 12),
  };
}