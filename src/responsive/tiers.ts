import { warnDeprecated } from "./legacy";
import type {
  Breakpoints,
  BreakpointsInput,
  DeviceType,
  ResolvedBreakpoints,
  Responsive,
  ResponsiveValues,
  Tier,
} from "./types";

export const TIERS: readonly Tier[] = ["compact", "medium", "expanded", "large"];

/**
 * BREAKPOINTS
 * Material 3 window size classes:
 * - compact  (< 600):     phones in portrait
 * - medium   (600–839):   tablets in portrait, large foldables, phones in landscape
 * - expanded (840–1199):  tablets in landscape
 * - large    (≥ 1200):    large tablets in landscape, desktop / web
 */
export const DEFAULT_BREAKPOINTS: Breakpoints = {
  medium: 600,
  expanded: 840,
  large: 1200,
};

/** ResponsiveRow's default stacking width (the 1.x `smallPhone` breakpoint). */
export const DEFAULT_STACK_BELOW = 320;

const LEGACY_KEY_TIER = {
  small: "compact",
  phone: "compact",
  tablet: "medium",
  largeTablet: "expanded",
} as const;

const RESPONSIVE_KEYS = new Set<string>([...TIERS, ...Object.keys(LEGACY_KEY_TIER)]);

export function tierIndex(tier: Tier): number {
  return TIERS.indexOf(tier);
}

/**
 * Fills in and validates breakpoints, accepting the 1.x names
 * (`phone` → `medium`, `tablet` → `expanded`). New names win.
 */
export function resolveBreakpoints(input?: BreakpointsInput): ResolvedBreakpoints {
  warnLegacyBreakpoints(input);

  const medium = input?.medium ?? input?.phone ?? DEFAULT_BREAKPOINTS.medium;
  const expanded = Math.max(
    medium,
    input?.expanded ?? input?.tablet ?? DEFAULT_BREAKPOINTS.expanded,
  );
  const large = Math.max(expanded, input?.large ?? DEFAULT_BREAKPOINTS.large);

  return {
    medium,
    expanded,
    large,
    smallPhone: input?.smallPhone ?? DEFAULT_STACK_BELOW,
    phone: medium,
    tablet: expanded,
  };
}

/**
 * Accepts either user input or already-resolved breakpoints (e.g. from
 * useResponsive()), so pure helpers can take both without re-validating
 * or re-warning about the legacy aliases resolved breakpoints carry.
 */
export function ensureResolvedBreakpoints(
  breakpoints?: BreakpointsInput | ResolvedBreakpoints,
): ResolvedBreakpoints {
  const candidate = breakpoints as Partial<ResolvedBreakpoints> | undefined;
  if (
    candidate &&
    typeof candidate.medium === "number" &&
    typeof candidate.expanded === "number" &&
    typeof candidate.large === "number" &&
    typeof candidate.smallPhone === "number" &&
    typeof candidate.phone === "number" &&
    typeof candidate.tablet === "number"
  ) {
    return candidate as ResolvedBreakpoints;
  }

  return resolveBreakpoints(breakpoints);
}

/** Applies a partial override (e.g. a hook's `override` argument) to resolved breakpoints. */
export function mergeBreakpoints(
  base: ResolvedBreakpoints,
  override?: BreakpointsInput,
): ResolvedBreakpoints {
  if (!override) return base;

  warnLegacyBreakpoints(override);

  const medium = override.medium ?? override.phone ?? base.medium;
  const expanded = Math.max(medium, override.expanded ?? override.tablet ?? base.expanded);
  const large = Math.max(expanded, override.large ?? base.large);

  return {
    medium,
    expanded,
    large,
    smallPhone: override.smallPhone ?? base.smallPhone,
    phone: medium,
    tablet: expanded,
  };
}

function warnLegacyBreakpoints(input?: BreakpointsInput): void {
  if (input?.phone !== undefined && input.medium === undefined) {
    warnDeprecated("breakpoints.phone", "breakpoints.phone is now breakpoints.medium");
  }
  if (input?.tablet !== undefined && input.expanded === undefined) {
    warnDeprecated("breakpoints.tablet", "breakpoints.tablet is now breakpoints.expanded");
  }
  if (input?.smallPhone !== undefined) {
    warnDeprecated(
      "breakpoints.smallPhone",
      "breakpoints.smallPhone no longer defines a tier; use ResponsiveRow's stackBelow",
    );
  }
}

export function getTier(width: number, breakpoints: Breakpoints): Tier {
  if (width >= breakpoints.large) return "large";
  if (width >= breakpoints.expanded) return "expanded";
  if (width >= breakpoints.medium) return "medium";
  return "compact";
}

/**
 * The 1.x device type for a width, kept for deprecated APIs. Note the old
 * large-tablet tier covers both `expanded` and `large`.
 */
export function getLegacyDeviceType(
  width: number,
  breakpoints: ResolvedBreakpoints,
): DeviceType {
  if (width < breakpoints.smallPhone) return "small-phone";
  if (width < breakpoints.medium) return "phone";
  if (width < breakpoints.expanded) return "tablet";
  return "large-tablet";
}

/**
 * True for a plain object whose keys are all tier names (or 1.x tier names),
 * i.e. `{ compact: 1, medium: 2 }` — as opposed to a plain value, a fluid
 * token, or a style object like `shadowOffset: { width, height }`.
 */
export function isResponsiveMap<T>(value: Responsive<T>): value is ResponsiveValues<T> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return false;

  return Object.keys(value).every((key) => RESPONSIVE_KEYS.has(key));
}

/**
 * Converts 1.x keys to tiers: small/phone → compact, tablet → medium,
 * largeTablet → expanded. New keys win when both are present.
 */
export function normalizeResponsiveValues<T>(
  values: ResponsiveValues<T>,
): { [K in Tier]?: T } {
  const { small, phone, tablet, largeTablet, ...tiers } = values;

  if (
    small === undefined &&
    phone === undefined &&
    tablet === undefined &&
    largeTablet === undefined
  ) {
    return tiers;
  }

  warnDeprecated(
    "responsive-keys",
    "Responsive values keyed small/phone/tablet/largeTablet should use compact/medium/expanded",
  );

  const normalized: { [K in Tier]?: T } = {};
  const legacyCompact = phone ?? small;
  if (legacyCompact !== undefined) normalized.compact = legacyCompact;
  if (tablet !== undefined) normalized.medium = tablet;
  if (largeTablet !== undefined) normalized.expanded = largeTablet;

  for (const tier of TIERS) {
    if (tiers[tier] !== undefined) normalized[tier] = tiers[tier];
  }

  return normalized;
}

/**
 * Resolves a responsive value for a tier, mobile-first: the tier's own
 * value, else the nearest smaller tier's, else `fallback`. Plain values
 * are returned as-is.
 */
export function resolveResponsive<T>(value: Responsive<T>, tier: Tier): T | undefined;
export function resolveResponsive<T>(value: Responsive<T>, tier: Tier, fallback: T): T;
export function resolveResponsive<T>(
  value: Responsive<T>,
  tier: Tier,
  fallback?: T,
): T | undefined {
  if (!isResponsiveMap(value)) return value as T;

  const values = normalizeResponsiveValues(value);

  for (let index = tierIndex(tier); index >= 0; index--) {
    const candidate = values[TIERS[index]];
    if (candidate !== undefined) return candidate;
  }

  return fallback;
}
