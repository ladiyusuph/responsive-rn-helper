import type {
  Breakpoints,
  FluidConfig,
  LayoutConfig,
  ResponsiveRadiiConfig,
  ResponsiveSpacingConfig,
  ResponsiveTypographyConfig,
} from "./types";

/**
 * BREAKPOINTS
 * Justification: Based on Material Design 3 layout breakpoints.
 * - smallPhone (360): Standard baseline for small Android devices.
 * - phone (600): The M3 "Medium" breakpoint (Portrait tablets, large foldables).
 * - tablet (840): The M3 "Expanded" breakpoint (Landscape tablets, small laptops).
 */
export const DEFAULT_BREAKPOINTS: Breakpoints = {
  smallPhone: 360,
  phone: 600,
  tablet: 840,
};

/**
 * BASE SPACING
 * Justification: Strict adherence to the 8pt spatial system.
 * Using multiples of 8 (with 4 for micro-adjustments) ensures clean pixel
 * rendering and consistent visual rhythm across iOS and Android.
 */
export const DEFAULT_SPACING = {
  xs: 4, // Micro-adjustments
  sm: 8, // Minimum standard gap
  md: 12, // Half-step gap
  lg: 16, // Default padding (Material standard)
  xl: 20, // Slightly looser padding
  xxl: 24, // Tablet padding standard
  xxxl: 32, // Large section gaps
} as const;

export const DEFAULT_RESPONSIVE_SPACING: ResponsiveSpacingConfig = {
  // Screen edges: 16px is standard for mobile (iOS & Android). 24px+ for tablets.
  screen: { small: 16, phone: 16, tablet: 24, largeTablet: 32 },
  // Sections: Needs distinct visual separation. 24px on mobile, 32px+ on larger screens.
  section: { small: 24, phone: 24, tablet: 32, largeTablet: 40 },
  // Cards: Material cards typically use 16px padding internally.
  card: { small: 12, phone: 16, tablet: 20, largeTablet: 24 },
  // Gaps: Default grid gaps.
  gap: { small: 8, phone: 12, tablet: 16, largeTablet: 20 },
};

/**
 * RADII (Border Radius)
 * Justification: Matches modern UI trends (e.g., iOS squircles, Material 3 Shape tokens).
 * 8: Small components (tags/chips) | 12: Buttons | 16: Cards | 24+: Modals/Bottom Sheets
 */
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
  // Modals/Cards often get rounder on bigger screens to look less boxy
  xxl: { small: 24, phone: 24, tablet: 28, largeTablet: 32 },
};

/**
 * TYPOGRAPHY
 * Justification:
 * - WCAG requires body text to be 16px (1rem) for baseline readability. iOS HIG uses 17pt.
 * - 12px is the absolute accessible minimum for legal/caption text.
 * - Scaling: Text doesn't need to scale massively on tablets because users hold them
 *   further away, but headers should scale up to fill the visual space.
 */
export const DEFAULT_TYPOGRAPHY: ResponsiveTypographyConfig = {
  xxs: { small: 10, phone: 10, tablet: 10, largeTablet: 10 }, // Badges only
  xs: { small: 12, phone: 12, tablet: 13, largeTablet: 14 }, // Captions/Legal
  sm: { small: 14, phone: 14, tablet: 15, largeTablet: 16 }, // Secondary text
  md: { small: 16, phone: 16, tablet: 17, largeTablet: 18 }, // Base Body (M3 Body Large)
  lg: { small: 18, phone: 18, tablet: 20, largeTablet: 22 }, // Subtitles / H6
  xl: { small: 20, phone: 20, tablet: 22, largeTablet: 24 }, // App Bar Titles / H5
  xxl: { small: 24, phone: 24, tablet: 28, largeTablet: 32 }, // H4
  "2xl": { small: 28, phone: 28, tablet: 32, largeTablet: 40 }, // H3
  "3xl": { small: 32, phone: 32, tablet: 40, largeTablet: 48 }, // Hero / Display
};

export const DEFAULT_LAYOUT: LayoutConfig = {
  // Mobile standards generally use 16px safe-area margins.
  horizontalPadding: { small: 16, phone: 16, tablet: 24, largeTablet: 32 },
  contentMaxWidth: {
    small: undefined,
    phone: undefined,
    tablet: 800,
    largeTablet: 1040, // M3 standard for max content width to prevent eye strain on long text
  },
  gap: { small: 8, phone: 12, tablet: 16, largeTablet: 24 },
  sectionGap: { small: 24, phone: 24, tablet: 32, largeTablet: 40 },
  cardPadding: { small: 16, phone: 16, tablet: 20, largeTablet: 24 },
  borderRadius: { small: 16, phone: 16, tablet: 24, largeTablet: 24 },
  actionColumns: { small: 1, phone: 2, tablet: 2, largeTablet: 3 },
  statColumns: { small: 1, phone: 2, tablet: 4, largeTablet: 4 }, // Stats look good in a row of 4 on tablets

  /**
   * ACCESSIBLE TOUCH TARGETS
   * Justification: Apple HIG requires a minimum of 44x44pt. Material Design 3 and
   * WCAG 2.1 Target Size (Level AAA) require a minimum of 48x48dp.
   * Buttons and Inputs should *never* be smaller than 48 height on mobile.
   */
  buttonHeight: {
    minWidth: 320,
    maxWidth: 900,
    minValue: 48, // Accessible minimum
    maxValue: 56, // M3 standard for prominent buttons
  } satisfies FluidConfig,

  inputHeight: {
    small: 48, // Accessibility constraint: 48dp minimum touch target
    phone: 48,
    tablet: 52,
    largeTablet: 56, // Standard desktop/large input size
  },

  inputPaddingHorizontal: {
    small: 16, // Visual balance for a 48px high input
    phone: 16,
    tablet: 20,
    largeTablet: 20,
  },

  /**
   * ICONS
   * Justification: 24x24 is the universal standard bounding box for icons (Material, Apple, Web).
   */
  iconSize: {
    xs: { small: 16, phone: 16, tablet: 18, largeTablet: 20 }, // Inline with small text
    sm: { small: 20, phone: 20, tablet: 22, largeTablet: 24 }, // Slightly smaller than standard
    md: { small: 24, phone: 24, tablet: 24, largeTablet: 28 }, // 24 standard icon size
    lg: { small: 32, phone: 32, tablet: 36, largeTablet: 40 }, // Prominent icons / Empty states
    xl: { small: 40, phone: 40, tablet: 48, largeTablet: 56 }, // Hero icons
  },
};
