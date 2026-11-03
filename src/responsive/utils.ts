import { warnDeprecated } from "./legacy";
import {
  ensureResolvedBreakpoints,
  getLegacyDeviceType,
  getTier,
  resolveResponsive,
  tierIndex,
} from "./tiers";
import type {
  BreakpointCondition,
  BreakpointsInput,
  DeviceType,
  FluidConfig,
  FormFactor,
  ResolvedBreakpoints,
  Responsive,
  ResponsiveValues,
  Tier,
} from "./types";

/**
 * @deprecated 2.0: use `resolveResponsive(values, tier, fallback)` with
 * `getTier(width, breakpoints)`, or the useResponsiveValue() hook.
 */
export function responsiveValue<T>(
  width: number,
  values: ResponsiveValues<T>,
  fallback: T,
  breakpoints: BreakpointsInput | ResolvedBreakpoints,
): T {
  warnDeprecated("responsiveValue", "responsiveValue() is now resolveResponsive()");
  return resolveResponsive(values, getTier(width, ensureResolvedBreakpoints(breakpoints)), fallback);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export type WindowClass = {
  tier: Tier;
  isLandscape: boolean;
  /** min(width, height) — stays the same when the device rotates. */
  shortestSide: number;
  /**
   * Physical device class, independent of orientation. A phone held in
   * landscape is often wider than the `expanded` breakpoint (e.g. 852pt on
   * an iPhone 15), so `tier` alone can't tell it from a tablet. Use
   * `formFactor` when you mean "is this hardware a phone or a tablet?".
   */
  formFactor: FormFactor;
};

/**
 * Pure window classification, extracted so it can be unit tested without
 * mounting a component.
 */
export function computeWindowClass(
  width: number,
  height: number,
  breakpoints: ResolvedBreakpoints,
): WindowClass {
  const shortestSide = Math.min(width, height);

  return {
    tier: getTier(width, breakpoints),
    isLandscape: width > height,
    shortestSide,
    formFactor: shortestSide >= breakpoints.medium ? "tablet" : "phone",
  };
}

/** The 1.x breakpoint flags, still available (deprecated) on useResponsive(). */
export type LegacyBreakpointFlags = {
  /** @deprecated 2.0: there's no tier below `compact`. */
  isSmallPhone: boolean;
  /** @deprecated 2.0: use `tier === "compact"` or `isBelow("medium")`. */
  isPhone: boolean;
  /** @deprecated 2.0: use `isAtLeast("medium")`. */
  isTablet: boolean;
  /** @deprecated 2.0: use `isAtLeast("expanded")`. */
  isLargeTablet: boolean;
  /** @deprecated 2.0: use `tier`. */
  deviceType: DeviceType;
};

export function computeLegacyFlags(
  width: number,
  breakpoints: ResolvedBreakpoints,
): LegacyBreakpointFlags {
  return {
    isSmallPhone: width < breakpoints.smallPhone,
    isPhone: width < breakpoints.medium,
    isTablet: width >= breakpoints.medium,
    isLargeTablet: width >= breakpoints.expanded,
    deviceType: getLegacyDeviceType(width, breakpoints),
  };
}

/**
 * @deprecated 2.0: use `computeWindowClass()`, which returns `tier` in place
 * of the 1.x device flags.
 */
export function computeBreakpointFlags(
  width: number,
  height: number,
  breakpoints: BreakpointsInput | ResolvedBreakpoints,
): WindowClass & LegacyBreakpointFlags {
  const resolved = ensureResolvedBreakpoints(breakpoints);

  return {
    ...computeWindowClass(width, height, resolved),
    ...computeLegacyFlags(width, resolved),
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
 * Pure clamp applied to the raw column count from computeGridColumns.
 *
 * Order matters: cap by maxColumns FIRST, then floor by minColumns. Doing
 * it the other way (or combining both into a single Math.min like the old
 * implementation did) silently drops minColumns whenever maxColumns isn't
 * also supplied, because `Math.min(calculated, Math.max(calculated, minColumns))`
 * always collapses back to `calculated`.
 *
 * If maxColumns < minColumns (a contradictory config), minColumns wins —
 * the caller is expected to warn about that in dev.
 */
export function resolveGridColumns(
  calculatedColumns: number,
  minColumns: number,
  maxColumns?: number,
): number {
  const cappedByMax =
    maxColumns !== undefined
      ? Math.min(calculatedColumns, maxColumns)
      : calculatedColumns;

  return Math.max(minColumns, cappedByMax);
}

/**
 * Normalizes an explicit `columns` value (from ResponsiveGrid's `columns`
 * prop) into a safe integer column count: rounds to the nearest whole
 * number and floors at 1, so `columns={0}` or a negative/fractional value
 * from a misconfigured responsive map never produces a broken layout.
 */
export function normalizeColumnCount(value: number): number {
  return Math.max(1, Math.round(value));
}

/**
 * Pure count of the empty cells ResponsiveGrid appends to a short last row,
 * so its items keep the same width as items in full rows. Zero when
 * `stretchLastRow` is on — the last row's items share the row instead.
 */
export function computeGridPlaceholderCount(
  childCount: number,
  columns: number,
  stretchLastRow: boolean,
): number {
  if (stretchLastRow || childCount <= 0 || columns <= 0) return 0;

  return (columns - (childCount % columns)) % columns;
}

export type GridLayoutOptions = {
  /** Width available to the grid (measured container width, ideally). */
  width: number;
  /** Explicit column count — bypasses auto-fit when provided. */
  columns?: Responsive<number>;
  /**
   * Tier used to resolve per-tier `columns`. Defaults to the tier of
   * `width`; ResponsiveGrid passes the screen's tier.
   */
  tier?: Tier;
  /** @default 160 */
  minItemWidth?: number;
  /** @default 12 */
  gap?: number;
  /** @default 1 */
  minColumns?: number;
  maxColumns?: number;
  breakpoints?: BreakpointsInput | ResolvedBreakpoints;
};

export type GridLayout = {
  numColumns: number;
  /** Exact width of one cell: (width - gap * (numColumns - 1)) / numColumns. */
  itemWidth: number;
  gap: number;
};

/**
 * Pure column + cell-width calculation shared by ResponsiveGrid and
 * useGridLayout. Explicit `columns` wins; otherwise auto-fit as many
 * `minItemWidth` columns as fit, clamped to [minColumns, maxColumns].
 */
export function computeGridLayout({
  width,
  columns,
  tier,
  minItemWidth = 160,
  gap = 12,
  minColumns = 1,
  maxColumns,
  breakpoints,
}: GridLayoutOptions): GridLayout {
  const numColumns =
    columns !== undefined
      ? normalizeColumnCount(
          resolveResponsive(
            columns,
            tier ?? getTier(width, ensureResolvedBreakpoints(breakpoints)),
            1,
          ),
        )
      : resolveGridColumns(
          computeGridColumns(width, minItemWidth, gap),
          minColumns,
          maxColumns,
        );

  const itemWidth = Math.max(0, (width - gap * (numColumns - 1)) / numColumns);

  return { numColumns, itemWidth, gap };
}

/**
 * Pure decision behind ResponsiveRow's stacking behavior: should the row
 * lay its children out in a column instead of a row, given the width
 * actually available to it?
 */
export function shouldStackRow(
  width: number,
  stackBelowWidth: number,
  stackOnSmall: boolean,
  fontScale?: { current: number; stackAt?: number },
): boolean {
  if (!stackOnSmall) return false;

  if (fontScale?.stackAt !== undefined && fontScale.current >= fontScale.stackAt) {
    return true;
  }

  return width < stackBelowWidth;
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

const LEGACY_DEVICE_ORDER: DeviceType[] = [
  "small-phone",
  "phone",
  "tablet",
  "large-tablet",
];

/** The tier a 1.x device type falls in, for matching tier names against it. */
const DEVICE_TYPE_TIER: Record<DeviceType, Tier> = {
  "small-phone": "compact",
  phone: "compact",
  tablet: "medium",
  "large-tablet": "expanded",
};

function isDeviceType(name: Tier | DeviceType): name is DeviceType {
  return name in DEVICE_TYPE_TIER;
}

type WindowPosition = { tier: Tier; deviceType: DeviceType };

/**
 * Compares one condition name against the window. Tier names compare by
 * tier; 1.x device names compare by the 1.x device type, so existing
 * conditions behave exactly as they did in 1.x.
 */
function compare(position: WindowPosition, name: Tier | DeviceType): number {
  if (isDeviceType(name)) {
    warnDeprecated(
      "condition-device-type",
      "ResponsiveShow/ResponsiveHide device names should be tiers (compact/medium/expanded/large)",
    );
    return (
      LEGACY_DEVICE_ORDER.indexOf(position.deviceType) -
      LEGACY_DEVICE_ORDER.indexOf(name)
    );
  }

  return tierIndex(position.tier) - tierIndex(name);
}

/**
 * Pure matcher behind ResponsiveShow/ResponsiveHide. `only` takes precedence
 * over `above`/`below` if both are given; `above`/`below` combine with AND.
 */
export function matchesBreakpointCondition(
  width: number,
  condition: BreakpointCondition,
  breakpoints?: BreakpointsInput | ResolvedBreakpoints,
): boolean;
/** @deprecated 2.0: pass the window width and breakpoints instead of a device type. */
export function matchesBreakpointCondition(
  deviceType: DeviceType,
  condition: BreakpointCondition,
): boolean;
export function matchesBreakpointCondition(
  widthOrDeviceType: number | DeviceType,
  condition: BreakpointCondition,
  breakpoints?: BreakpointsInput | ResolvedBreakpoints,
): boolean {
  let position: WindowPosition;

  if (typeof widthOrDeviceType === "number") {
    const resolved = ensureResolvedBreakpoints(breakpoints);
    position = {
      tier: getTier(widthOrDeviceType, resolved),
      deviceType: getLegacyDeviceType(widthOrDeviceType, resolved),
    };
  } else {
    position = {
      tier: DEVICE_TYPE_TIER[widthOrDeviceType],
      deviceType: widthOrDeviceType,
    };
  }

  if (condition.only !== undefined) {
    const only = Array.isArray(condition.only) ? condition.only : [condition.only];
    return only.some((name) => compare(position, name) === 0);
  }

  let matches = true;

  if (condition.above !== undefined) {
    matches = matches && compare(position, condition.above) >= 0;
  }
  if (condition.below !== undefined) {
    matches = matches && compare(position, condition.below) <= 0;
  }

  return matches;
}

/**
 * Structural equality for plain config data (objects, arrays, primitives).
 * Used by ResponsiveProvider so an inline `config={{...}}` prop doesn't hand
 * every consumer a new context value on each render.
 */
export function isDeepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null ||
    Array.isArray(a) !== Array.isArray(b)
  ) {
    return false;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;

  return aKeys.every(
    (key) =>
      Object.prototype.hasOwnProperty.call(b, key) &&
      isDeepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      ),
  );
}
