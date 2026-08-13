export type Breakpoints = {
  smallPhone: number;
  phone: number;
  tablet: number;
};

export type DeviceType =
  | "small-phone"
  | "phone"
  | "tablet"
  | "large-tablet";

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

export type BreakpointCondition = {
  /** Show/match at or above this tier (inclusive). */
  above?: DeviceType;
  /** Show/match at or below this tier (inclusive). */
  below?: DeviceType;
  /** Show/match only at this tier, or one of these tiers. Overrides above/below. */
  only?: DeviceType | DeviceType[];
};