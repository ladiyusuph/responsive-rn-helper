import { DEFAULT_BREAKPOINTS, DEFAULT_LAYOUT } from "./constants";
import type {
  Breakpoints,
  BreakpointCondition,
  DeviceType,
  FluidConfig,
  LayoutConfig,
  ResponsiveValues,
} from "./types";

export function responsiveValue<T>(
  width: number,
  values: ResponsiveValues<T>,
  fallback: T,
  breakpoints: Breakpoints,
): T {
  if (width >= breakpoints.tablet && values.largeTablet !== undefined)
    return values.largeTablet;
  if (width >= breakpoints.phone && values.tablet !== undefined)
    return values.tablet;
  if (width >= breakpoints.smallPhone && values.phone !== undefined)
    return values.phone;
  return values.small ?? fallback;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export type BreakpointFlags = {
  isSmallPhone: boolean;
  /** True for small-phone AND phone widths (i.e. "at most phone-sized"). */
  isPhone: boolean;
  /** True for tablet AND large-tablet widths (i.e. "at least tablet-sized"). */
  isTablet: boolean;
  isLargeTablet: boolean;
  isLandscape: boolean;
  deviceType: DeviceType;
};

/**
 * Pure breakpoint classification, extracted so it can be unit tested without
 * mounting a component. isPhone/isTablet are intentionally cumulative
 * ("at most"/"at least") — use deviceType when you need a single mutually
 * exclusive bucket, or isLargeTablet/isSmallPhone for the exact edges.
 */
export function computeBreakpointFlags(
  width: number,
  height: number,
  breakpoints: Breakpoints,
): BreakpointFlags {
  const isSmallPhone = width < breakpoints.smallPhone;
  const isPhone = width < breakpoints.phone;
  const isTablet = width >= breakpoints.phone;
  const isLargeTablet = width >= breakpoints.tablet;

  const deviceType: DeviceType =
    width < breakpoints.smallPhone
      ? "small-phone"
      : width < breakpoints.phone
        ? "phone"
        : width < breakpoints.tablet
          ? "tablet"
          : "large-tablet";

  return {
    isSmallPhone,
    isPhone,
    isTablet,
    isLargeTablet,
    isLandscape: width > height,
    deviceType,
  };
}

export type LayoutTokens = {
  horizontalPadding: number;
  contentMaxWidth: number | undefined;
  gap: number;
  sectionGap: number;
  cardPadding: number;
  borderRadius: number;
  actionColumns: number;
  statColumns: number;
  buttonHeight: number;
};

/**
 * Pure derivation of layout tokens from breakpoint flags. Every tier check
 * that has a large-tablet value must check isLargeTablet BEFORE isTablet,
 * since isTablet stays true for large tablets too (see BreakpointFlags).
 */
export function computeLayoutTokens(
  _flags: BreakpointFlags,
  width: number,
  layout: LayoutConfig = DEFAULT_LAYOUT,
  breakpoints: Breakpoints = DEFAULT_BREAKPOINTS,
): LayoutTokens {
  const resolve = <T>(values: ResponsiveValues<T>, fallback: T): T =>
    responsiveValue(width, values, fallback, breakpoints);

  return {
    horizontalPadding: resolve(layout.horizontalPadding, 16),
    contentMaxWidth: resolve(layout.contentMaxWidth, undefined),
    gap: resolve(layout.gap, 12),
    sectionGap: resolve(layout.sectionGap, 20),
    cardPadding: resolve(layout.cardPadding, 16),
    borderRadius: resolve(layout.borderRadius, 20),
    actionColumns: resolve(layout.actionColumns, 2),
    statColumns: resolve(layout.statColumns, 2),
    buttonHeight: fluidValue(width, layout.buttonHeight),
  };
}

/**
 * Pure column-count calculation for ResponsiveGrid, given the width actually
 * available to the grid (not necessarily the device/screen width).
 */
export function computeGridColumns(
  width: number,
  minItemWidth: number,
  gap: number,
): number {
  if (width <= 0 || minItemWidth <= 0) {
    return 1;
  }

  const safeGap = Math.max(0, gap);

  const columns = Math.floor((width + safeGap) / (minItemWidth + safeGap));

  return Math.max(1, columns);
}
/**
 * Smooth CSS clamp()-style interpolation: `minValue` at `minWidth` and below,
 * `maxValue` at `maxWidth` and above, linearly interpolated in between.
 * Use this when a value should scale continuously with the viewport instead
 * of jumping between breakpoint tiers (that's what useResponsiveValue is for).
 */
export function fluidValue(width: number, config: FluidConfig): number {
  const { minWidth, maxWidth, minValue, maxValue } = config;

  if (maxWidth <= minWidth) return maxValue;
  if (width <= minWidth) return minValue;
  if (width >= maxWidth) return maxValue;

  const progress = (width - minWidth) / (maxWidth - minWidth);
  return minValue + progress * (maxValue - minValue);
}

const DEVICE_TYPE_ORDER: DeviceType[] = [
  "small-phone",
  "phone",
  "tablet",
  "large-tablet",
];

/**
 * Pure matcher behind ResponsiveShow/ResponsiveHide. `only` takes precedence
 * over `above`/`below` if both are given; `above`/`below` combine with AND.
 */
export function matchesBreakpointCondition(
  deviceType: DeviceType,
  condition: BreakpointCondition,
): boolean {
  if (condition.only !== undefined) {
    const only = Array.isArray(condition.only)
      ? condition.only
      : [condition.only];
    return only.includes(deviceType);
  }

  const order = DEVICE_TYPE_ORDER.indexOf(deviceType);
  let matches = true;

  if (condition.above !== undefined) {
    matches = matches && order >= DEVICE_TYPE_ORDER.indexOf(condition.above);
  }
  if (condition.below !== undefined) {
    matches = matches && order <= DEVICE_TYPE_ORDER.indexOf(condition.below);
  }

  return matches;
}
