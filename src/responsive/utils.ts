import { DEFAULT_BREAKPOINTS, DEFAULT_LAYOUT } from "./constants";
import type {
  Breakpoints,
  BreakpointCondition,
  DeviceType,
  FluidConfig,
  FormFactor,
  LayoutConfig,
  ResponsiveRadiiConfig,
  ResponsiveSizeValuesConfig,
  ResponsiveSpacingConfig,
  ResponsiveTypographyConfig,
  ResponsiveValues,
} from "./types";

export function responsiveValue<T>(
  width: number,
  values: ResponsiveValues<T>,
  fallback: T,
  breakpoints: Breakpoints,
): T {
  if (width >= breakpoints.tablet) {
    return (
      values.largeTablet ??
      values.tablet ??
      values.phone ??
      values.small ??
      fallback
    );
  }

  if (width >= breakpoints.phone) {
    return values.tablet ?? values.phone ?? values.small ?? fallback;
  }

  if (width >= breakpoints.smallPhone) {
    return values.phone ?? values.small ?? fallback;
  }

  return values.small ?? values.phone ?? fallback;
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
  /** min(width, height) — stays the same when the device rotates. */
  shortestSide: number;
  /**
   * Physical device class, independent of orientation. A phone held in
   * landscape is often wider than the `tablet` breakpoint (e.g. 852pt on an
   * iPhone 15), so `deviceType` alone would call it a large tablet. Use
   * `formFactor` when you mean "is this hardware a phone or a tablet?".
   */
  formFactor: FormFactor;
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
  const shortestSide = Math.min(width, height);

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
    shortestSide,
    formFactor: shortestSide >= breakpoints.phone ? "tablet" : "phone",
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
  inputHeight: number;
  inputPaddingHorizontal: number;
  iconSize: IconSizeTokens;
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

    inputHeight: resolve(layout.inputHeight ?? {}, 46),

    inputPaddingHorizontal: resolve(layout.inputPaddingHorizontal ?? {}, 14),

    iconSize: computeIconSizeTokens(width, layout.iconSize, breakpoints),
  };
}

export type SpacingTokens = Record<keyof ResponsiveSpacingConfig, number>;
export type TypographyTokens = Record<keyof ResponsiveTypographyConfig, number>;
export type RadiiTokens = Record<keyof ResponsiveRadiiConfig, number>;
export type IconSizeTokens = Record<keyof ResponsiveSizeValuesConfig<number>, number>;

export function computeSpacingTokens(
  width: number,
  spacing: ResponsiveSpacingConfig,
  breakpoints: Breakpoints,
): SpacingTokens {
  const resolve = (values: ResponsiveValues<number>, fallback: number) =>
    responsiveValue(width, values, fallback, breakpoints);

  return {
    screen: resolve(spacing.screen, 16),
    section: resolve(spacing.section, 20),
    card: resolve(spacing.card, 16),
    gap: resolve(spacing.gap, 12),
  };
}

export function computeTypographyTokens(
  width: number,
  typography: ResponsiveTypographyConfig,
  breakpoints: Breakpoints,
): TypographyTokens {
  const resolve = (values: ResponsiveValues<number>, fallback: number) =>
    responsiveValue(width, values, fallback, breakpoints);

  return {
    xxs: resolve(typography.xxs, 9),
    xs: resolve(typography.xs, 10),
    sm: resolve(typography.sm, 12),
    md: resolve(typography.md, 14),
    lg: resolve(typography.lg, 16),
    xl: resolve(typography.xl, 18),
    xxl: resolve(typography.xxl, 20),
    "2xl": resolve(typography["2xl"], 22),
    "3xl": resolve(typography["3xl"], 26),
  };
}

export function computeRadiiTokens(
  width: number,
  radii: ResponsiveRadiiConfig,
  breakpoints: Breakpoints,
): RadiiTokens {
  const resolve = (values: ResponsiveValues<number>, fallback: number) =>
    responsiveValue(width, values, fallback, breakpoints);

  return {
    sm: resolve(radii.sm, 8),
    md: resolve(radii.md, 12),
    lg: resolve(radii.lg, 16),
    xl: resolve(radii.xl, 20),
    xxl: resolve(radii.xxl, 24),
  };
}

export function computeIconSizeTokens(
  width: number,
  iconSize: ResponsiveSizeValuesConfig<number>,
  breakpoints: Breakpoints,
): IconSizeTokens {
  const resolve = (values: ResponsiveValues<number>, fallback: number) =>
    responsiveValue(width, values, fallback, breakpoints);

  return {
    xs: resolve(iconSize.xs, 14),
    sm: resolve(iconSize.sm, 18),
    md: resolve(iconSize.md, 22),
    lg: resolve(iconSize.lg, 26),
    xl: resolve(iconSize.xl, 30),
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
  columns?: number | ResponsiveValues<number>;
  /** @default 160 */
  minItemWidth?: number;
  /** @default 12 */
  gap?: number;
  /** @default 1 */
  minColumns?: number;
  maxColumns?: number;
  breakpoints?: Breakpoints;
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
  minItemWidth = 160,
  gap = 12,
  minColumns = 1,
  maxColumns,
  breakpoints = DEFAULT_BREAKPOINTS,
}: GridLayoutOptions): GridLayout {
  const numColumns =
    columns !== undefined
      ? normalizeColumnCount(
          typeof columns === "number"
            ? columns
            : responsiveValue(width, columns, 1, breakpoints),
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
