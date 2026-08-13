import type { Breakpoints } from "./types";

export const DEFAULT_BREAKPOINTS: Breakpoints = {
  smallPhone: 360,
  phone: 600,
  tablet: 840,
};

export const DEFAULT_SPACING = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32,
} as const;

export const DEFAULT_RADII = {
  sm: 8, md: 12, lg: 16, xl: 20, xxl: 24,
} as const;