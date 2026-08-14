import type {
  Breakpoints,
  FluidConfig,
  LayoutConfig,
  ResponsiveRadiiConfig,
  ResponsiveSpacingConfig,
  ResponsiveTypographyConfig,
} from "./types";

export const DEFAULT_BREAKPOINTS: Breakpoints = {
  smallPhone: 360,
  phone: 600,
  tablet: 840,
};

/** Base spacing scale for consumers that want simple, non-responsive values. */
export const DEFAULT_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const DEFAULT_RESPONSIVE_SPACING: ResponsiveSpacingConfig = {
  screen: { small: 12, phone: 16, tablet: 24, largeTablet: 32 },
  section: { small: 16, phone: 20, tablet: 24, largeTablet: 32 },
  card: { small: 12, phone: 16, tablet: 20, largeTablet: 24 },
  gap: { small: 8, phone: 12, tablet: 16, largeTablet: 20 },
};

export const DEFAULT_RADII = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const DEFAULT_RESPONSIVE_RADII: ResponsiveRadiiConfig = {
  sm: { small: 8, phone: 8, tablet: 8, largeTablet: 8 },
  md: { small: 12, phone: 12, tablet: 12, largeTablet: 12 },
  lg: { small: 16, phone: 16, tablet: 16, largeTablet: 16 },
  xl: { small: 20, phone: 20, tablet: 20, largeTablet: 20 },
  xxl: { small: 24, phone: 24, tablet: 24, largeTablet: 24 },
};

export const DEFAULT_TYPOGRAPHY: ResponsiveTypographyConfig = {
  xxs: { small: 8, phone: 9, tablet: 10, largeTablet: 10 },
  xs: { small: 10, phone: 10, tablet: 11, largeTablet: 12 },
  sm: { small: 12, phone: 12, tablet: 13, largeTablet: 14 },
  md: { small: 14, phone: 14, tablet: 15, largeTablet: 16 },
  lg: { small: 16, phone: 16, tablet: 17, largeTablet: 18 },
  xl: { small: 18, phone: 18, tablet: 20, largeTablet: 21 },
  xxl: { small: 20, phone: 20, tablet: 22, largeTablet: 24 },
  "2xl": { small: 22, phone: 22, tablet: 24, largeTablet: 28 },
  "3xl": { small: 26, phone: 26, tablet: 28, largeTablet: 32 },
};

export const DEFAULT_LAYOUT: LayoutConfig = {
  horizontalPadding: { small: 12, phone: 16, tablet: 24, largeTablet: 32 },
  contentMaxWidth: {
    small: undefined,
    phone: undefined,
    tablet: 800,
    largeTablet: 1000,
  },
  gap: { small: 8, phone: 12, tablet: 16, largeTablet: 20 },
  sectionGap: { small: 16, phone: 20, tablet: 24, largeTablet: 28 },
  cardPadding: { small: 12, phone: 16, tablet: 20, largeTablet: 24 },
  borderRadius: { small: 16, phone: 20, tablet: 24, largeTablet: 24 },
  actionColumns: { small: 1, phone: 2, tablet: 2, largeTablet: 3 },
  statColumns: { small: 1, phone: 2, tablet: 2, largeTablet: 4 },
  buttonHeight: {
    minWidth: 320,
    maxWidth: 900,
    minValue: 48,
    maxValue: 56,
  } satisfies FluidConfig,
  inputHeight: {
    small: 44,
    phone: 46,
    tablet: 50,
    largeTablet: 52,
  },

  inputPaddingHorizontal: {
    small: 12,
    phone: 14,
    tablet: 16,
    largeTablet: 18,
  },
  iconSize: {
    xs: { small: 12, phone: 14, tablet: 16, largeTablet: 18 },
    sm: { small: 16, phone: 18, tablet: 20, largeTablet: 22 },
    md: { small: 20, phone: 22, tablet: 24, largeTablet: 26 },
    lg: { small: 24, phone: 26, tablet: 28, largeTablet: 30 },
    xl: { small: 28, phone: 30, tablet: 34, largeTablet: 38 },
  },
};
