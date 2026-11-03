import type { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { isResponsiveMap, resolveResponsive } from "./tiers";
import type { LegacyResponsiveValues, ResponsiveValues, Tier } from "./types";

/** A style whose properties can each be one value per tier. */
export type ResponsiveStyle<S> = {
  [K in keyof S]: S[K] | ResponsiveValues<S[K]>;
};

type AnyResponsiveStyle =
  | ResponsiveStyle<ViewStyle>
  | ResponsiveStyle<TextStyle>
  | ResponsiveStyle<ImageStyle>;

export type NamedResponsiveStyles<T> = { [P in keyof T]: AnyResponsiveStyle };

type ResponsiveKey = Tier | keyof LegacyResponsiveValues<unknown>;

/**
 * Unwraps a per-tier map to its value type. Only object types that declare
 * a tier key count as maps: structural matching alone would also unwrap
 * index-signature styles (e.g. fontVariationSettings) and strings, which
 * have a legacy HTML `small()` method that looks like the 1.x `small` key.
 */
type Unresponsive<V> = V extends object
  ? [Extract<keyof V, ResponsiveKey>] extends [never]
    ? V
    : V extends ResponsiveValues<infer U>
      ? U
      : V
  : V;

export type ResolvedStyles<T> = {
  [P in keyof T]: { [K in keyof T[P]]: Unresponsive<T[P][K]> };
};

/**
 * Pure resolution behind createStyles: replaces every per-tier value with
 * the current tier's value and drops properties with no value for it.
 */
export function resolveStyles<T extends Record<string, object>>(
  styles: T,
  tier: Tier,
): ResolvedStyles<T> {
  const resolved = {} as Record<string, Record<string, unknown>>;

  for (const [name, style] of Object.entries(styles)) {
    const out: Record<string, unknown> = {};

    for (const [property, value] of Object.entries(style)) {
      const resolvedValue = isResponsiveMap(value)
        ? resolveResponsive(value, tier)
        : value;

      if (resolvedValue !== undefined) out[property] = resolvedValue;
    }

    resolved[name] = out;
  }

  return resolved as ResolvedStyles<T>;
}
