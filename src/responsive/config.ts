import {
  DEFAULT_ICON_SIZES,
  DEFAULT_LAYOUT,
  DEFAULT_LEGACY_TOKENS,
  DEFAULT_RADII,
  DEFAULT_SIZES,
  DEFAULT_SPACING,
  DEFAULT_TEXT,
  DEFAULT_TYPOGRAPHY,
  fluid,
} from "./constants";
import { warnDeprecated, warnOnce } from "./legacy";
import {
  getTier,
  isResponsiveMap,
  normalizeResponsiveValues,
  resolveBreakpoints,
  resolveResponsive,
} from "./tiers";
import { fluidValue } from "./utils";
import type {
  Breakpoints,
  FluidConfig,
  FluidToken,
  ResolvedTextStyle,
  Responsive,
  ResponsiveConfig,
  ResponsiveConfigInput,
  TextVariant,
  TokenGroup,
  TokenValue,
  Tokens,
} from "./types";

/**
 * Identity function that preserves your config's exact token names, so
 * `typeof config` can be registered for typed custom tokens:
 *
 * ```ts
 * export const config = defineConfig({ spacing: { hero: 64 } });
 *
 * declare module "@ladiyusuph/responsive-rn" {
 *   interface Register {
 *     config: typeof config;
 *   }
 * }
 * ```
 */
export function defineConfig<const C extends ResponsiveConfigInput>(config: C): C {
  return config;
}

export function isFluidToken(value: unknown): value is FluidToken {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as FluidToken).kind === "fluid"
  );
}

function isLegacyFluidConfig(value: unknown): value is FluidConfig {
  return typeof value === "object" && value !== null && "minValue" in value;
}

function normalizeTokenValue(value: TokenValue | FluidConfig): TokenValue {
  if (isLegacyFluidConfig(value)) {
    warnDeprecated(
      "fluid-config",
      "{ minWidth, maxWidth, minValue, maxValue } should be fluid(minValue, maxValue, { from, to })",
    );
    return fluid(value.minValue, value.maxValue, {
      from: value.minWidth,
      to: value.maxWidth,
    });
  }

  return isResponsiveMap(value) ? normalizeResponsiveValues(value) : value;
}

/**
 * Merges one token over its default. Two per-tier maps merge tier by tier
 * (so `{ medium: 30 }` keeps the default's other tiers); anything else
 * replaces the default outright.
 */
function mergeTokenValue<T>(
  base: Responsive<T> | undefined,
  override: Responsive<T> | undefined,
): Responsive<T> | undefined {
  if (override === undefined) return base;
  if (base !== undefined && isResponsiveMap(base) && isResponsiveMap(override)) {
    return { ...normalizeResponsiveValues(base), ...normalizeResponsiveValues(override) };
  }
  return isResponsiveMap(override) ? normalizeResponsiveValues(override) : override;
}

function mergeGroup(
  defaults: TokenGroup,
  ...overrides: Array<Record<string, TokenValue | FluidConfig | undefined> | undefined>
): TokenGroup {
  const merged: TokenGroup = { ...defaults };

  for (const group of overrides) {
    if (!group) continue;
    for (const [key, value] of Object.entries(group)) {
      if (value === undefined) continue;
      merged[key] = mergeTokenValue(merged[key], normalizeTokenValue(value)) as TokenValue;
    }
  }

  return merged;
}

/**
 * Merges a config over the defaults, translating 1.x names along the way
 * (each warns once in development).
 */
export function normalizeConfig(input?: ResponsiveConfigInput): ResponsiveConfig {
  const layout = input?.layout ?? {};

  const legacyLayout = (key: string, replacement: string) => {
    if ((layout as Record<string, unknown>)[key] !== undefined) {
      warnDeprecated(`layout.${key}`, `layout.${key} is now ${replacement}`);
    }
    return (layout as Record<string, TokenValue | FluidConfig | undefined>)[key];
  };

  // 1.x layout tokens map onto 2.0 groups. Passed first, so the 2.0 key
  // wins if both are given.
  const legacySpacing = {
    screen: legacyLayout("horizontalPadding", "spacing.screen"),
    gap: legacyLayout("gap", "spacing.gap"),
    section: legacyLayout("sectionGap", "spacing.section"),
    card: legacyLayout("cardPadding", "spacing.card"),
    input: legacyLayout("inputPaddingHorizontal", "spacing.input"),
  };
  const legacySizes = {
    buttonHeight: legacyLayout("buttonHeight", "sizes.buttonHeight"),
    inputHeight: legacyLayout("inputHeight", "sizes.inputHeight"),
  };
  if (layout.iconSize !== undefined) {
    warnDeprecated("layout.iconSize", "layout.iconSize is now iconSizes");
  }
  if (layout.contentMaxWidth !== undefined) {
    warnDeprecated("layout.contentMaxWidth", "layout.contentMaxWidth is now layout.containerMaxWidth");
  }

  const legacyToken = (key: keyof typeof DEFAULT_LEGACY_TOKENS) =>
    mergeTokenValue<number>(
      DEFAULT_LEGACY_TOKENS[key],
      legacyLayout(key, "a token of your own") as Responsive<number> | undefined,
    ) as Responsive<number>;

  return {
    breakpoints: resolveBreakpoints(input?.breakpoints),
    spacing: mergeGroup(DEFAULT_SPACING, legacySpacing, input?.spacing),
    radii: mergeGroup(DEFAULT_RADII, input?.radii),
    typography: mergeGroup(DEFAULT_TYPOGRAPHY, input?.typography),
    iconSizes: mergeGroup(DEFAULT_ICON_SIZES, layout.iconSize, input?.iconSizes),
    sizes: mergeGroup(DEFAULT_SIZES, legacySizes, input?.sizes),
    text: { ...DEFAULT_TEXT, ...input?.text },
    layout: {
      containerMaxWidth: mergeTokenValue(
        mergeTokenValue(DEFAULT_LAYOUT.containerMaxWidth, layout.contentMaxWidth),
        layout.containerMaxWidth,
      ),
    },
    legacy: {
      borderRadius: legacyToken("borderRadius"),
      actionColumns: legacyToken("actionColumns"),
      statColumns: legacyToken("statColumns"),
    },
  };
}

/** Resolves one token for a window width: per-tier, fluid, or plain. */
export function resolveTokenValue(
  value: TokenValue,
  width: number,
  breakpoints: Breakpoints,
): number {
  if (isFluidToken(value)) {
    return fluidValue(width, {
      minWidth: value.from ?? 320,
      maxWidth: value.to ?? breakpoints.expanded,
      minValue: value.min,
      maxValue: value.max,
    });
  }

  return resolveResponsive(value, getTier(width, breakpoints), 0);
}

export function groupHasFluid(group: TokenGroup): boolean {
  return Object.values(group).some(isFluidToken);
}

export function resolveTokenGroup<K extends string>(
  group: TokenGroup,
  width: number,
  breakpoints: Breakpoints,
): Record<K, number> {
  const resolved = {} as Record<string, number>;
  for (const [key, value] of Object.entries(group)) {
    resolved[key] = resolveTokenValue(value, width, breakpoints);
  }
  return resolved as Record<K, number>;
}

export function resolveTextVariants(
  text: Record<string, TextVariant>,
  typography: Record<string, number>,
  width: number,
  breakpoints: Breakpoints,
): Record<string, ResolvedTextStyle> {
  const resolved: Record<string, ResolvedTextStyle> = {};

  for (const [name, { fontSize, lineHeight, ...rest }] of Object.entries(text)) {
    let size: number;
    if (typeof fontSize === "string") {
      size = typography[fontSize] ?? 14;
      if (typography[fontSize] === undefined) {
        warnOnce(
          `text.${name}`,
          `text.${name} refers to unknown typography token "${fontSize}"`,
        );
      }
    } else {
      size = resolveTokenValue(fontSize, width, breakpoints);
    }

    resolved[name] = {
      ...rest,
      fontSize: size,
      ...(lineHeight !== undefined && { lineHeight: Math.round(size * lineHeight) }),
    };
  }

  return resolved;
}

/** Every token in the config, resolved for a window width. */
export function resolveTokens(config: ResponsiveConfig, width: number): Tokens {
  const { breakpoints } = config;
  const typography = resolveTokenGroup(config.typography, width, breakpoints);

  return {
    spacing: resolveTokenGroup(config.spacing, width, breakpoints),
    radii: resolveTokenGroup(config.radii, width, breakpoints),
    typography,
    iconSizes: resolveTokenGroup(config.iconSizes, width, breakpoints),
    sizes: resolveTokenGroup(config.sizes, width, breakpoints),
    text: resolveTextVariants(config.text, typography, width, breakpoints),
    containerMaxWidth: resolveResponsive(
      config.layout.containerMaxWidth,
      getTier(width, breakpoints),
    ),
  } as Tokens;
}
