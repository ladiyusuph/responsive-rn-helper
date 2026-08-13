export type Breakpoints = {
  smallPhone: number;
  phone: number;
  tablet: number;
};

export type DeviceType = "small-phone" | "phone" | "tablet" | "large-tablet";

export type ResponsiveValues<T> = {
  small?: T;
  phone?: T;
  tablet?: T;
  largeTablet?: T;
};

export type FluidConfig = {
  minWidth: number;
  maxWidth: number;
  minValue: number;
  maxValue: number;
};

export type ResponsiveSpacingConfig = {
  screen: ResponsiveValues<number>;
  section: ResponsiveValues<number>;
  card: ResponsiveValues<number>;
  gap: ResponsiveValues<number>;
};

export type ResponsiveTypographyConfig = Record<
  "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "2xl" | "3xl",
  ResponsiveValues<number>
>;

export type ResponsiveRadiiConfig = {
  sm: ResponsiveValues<number>;
  md: ResponsiveValues<number>;
  lg: ResponsiveValues<number>;
  xl: ResponsiveValues<number>;
  xxl: ResponsiveValues<number>;
};

export type LayoutConfig = {
  horizontalPadding: ResponsiveValues<number>;
  contentMaxWidth: ResponsiveValues<number | undefined>;
  gap: ResponsiveValues<number>;
  sectionGap: ResponsiveValues<number>;
  cardPadding: ResponsiveValues<number>;
  borderRadius: ResponsiveValues<number>;
  actionColumns: ResponsiveValues<number>;
  statColumns: ResponsiveValues<number>;
  buttonHeight: FluidConfig;
};

export type ResponsiveConfig = {
  breakpoints: Breakpoints;
  spacing: ResponsiveSpacingConfig;
  typography: ResponsiveTypographyConfig;
  radii: ResponsiveRadiiConfig;
  layout: LayoutConfig;
};

export type ResponsiveConfigOverrides = {
  breakpoints?: Partial<Breakpoints>;
  spacing?: Partial<ResponsiveSpacingConfig>;
  typography?: Partial<ResponsiveTypographyConfig>;
  radii?: Partial<ResponsiveRadiiConfig>;
  layout?: Partial<LayoutConfig>;
};

export type BreakpointCondition = {
  /** Show/match at or above this tier (inclusive). */
  above?: DeviceType;
  /** Show/match at or below this tier (inclusive). */
  below?: DeviceType;
  /** Show/match only at this tier, or one of these tiers. Overrides above/below. */
  only?: DeviceType | DeviceType[];
};
