import type { TextStyle } from "react-native";

/**
 * Window size tiers (Material 3 window size classes). Tiers describe the
 * space available, not the hardware: a phone in landscape can be `expanded`.
 */
export type Tier = "compact" | "medium" | "expanded" | "large";

/** Minimum width at which each tier starts. `compact` always starts at 0. */
export type Breakpoints = {
  medium: number;
  expanded: number;
  large: number;
};

export type LegacyBreakpoints = {
  /**
   * @deprecated 2.0: there is no tier below `compact`. Only still used as
   * ResponsiveRow's default stacking width — pass `stackBelow` instead.
   */
  smallPhone?: number;
  /** @deprecated 2.0: renamed to `medium` (where the old tablet tier started). */
  phone?: number;
  /** @deprecated 2.0: renamed to `expanded` (where the old large-tablet tier started). */
  tablet?: number;
};

export type BreakpointsInput = Partial<Breakpoints> & LegacyBreakpoints;

/** Breakpoints as resolved by the provider and returned by useResponsive(). */
export type ResolvedBreakpoints = Breakpoints & {
  /** @deprecated 2.0: see ResponsiveRow's `stackBelow`. */
  smallPhone: number;
  /** @deprecated 2.0: use `medium`. */
  phone: number;
  /** @deprecated 2.0: use `expanded`. */
  tablet: number;
};

/** @deprecated 2.0: use `Tier` ("compact" | "medium" | "expanded" | "large"). */
export type DeviceType = "small-phone" | "phone" | "tablet" | "large-tablet";

export type FormFactor = "phone" | "tablet";

export type LegacyResponsiveValues<T> = {
  /** @deprecated 2.0: use `compact`. */
  small?: T;
  /** @deprecated 2.0: use `compact`. */
  phone?: T;
  /** @deprecated 2.0: use `medium`. */
  tablet?: T;
  /** @deprecated 2.0: use `expanded`. */
  largeTablet?: T;
};

/**
 * One value per tier. Mobile-first: a tier without its own value uses the
 * nearest smaller tier's value.
 *
 * { compact: 1, medium: 2, expanded: 3 }
 */
export type ResponsiveValues<T> = { [K in Tier]?: T } & LegacyResponsiveValues<T>;

/** A plain value, or one value per tier. */
export type Responsive<T> = T | ResponsiveValues<T>;

/** A value that scales linearly with window width. Create it with `fluid()`. */
export type FluidToken = {
  kind: "fluid";
  min: number;
  max: number;
  /** Width at which `min` applies. @default 320 */
  from?: number;
  /** Width at which `max` applies. @default the `expanded` breakpoint */
  to?: number;
};

/** @deprecated 2.0: use `fluid(minValue, maxValue, { from: minWidth, to: maxWidth })`. */
export type FluidConfig = {
  minWidth: number;
  maxWidth: number;
  minValue: number;
  maxValue: number;
};

/** A design token: a number, one number per tier, or a fluid value. */
export type TokenValue = Responsive<number> | FluidToken;

export type TokenGroup = Record<string, TokenValue>;

export type TextVariant = Omit<TextStyle, "fontSize" | "lineHeight"> & {
  /** A `typography` token name ("md"), or a size. */
  fontSize: string | TokenValue;
  /** Multiplier of the resolved font size, like unitless CSS line-height. */
  lineHeight?: number;
};

export type ResolvedTextStyle = Omit<TextStyle, "fontSize" | "lineHeight"> & {
  fontSize: number;
  lineHeight?: number;
};

export type DefaultSpacingKey =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl"
  | "xxxl"
  | "screen"
  | "section"
  | "card"
  | "gap"
  | "input";

export type DefaultRadiiKey = "sm" | "md" | "lg" | "xl" | "xxl";

export type DefaultTypographyKey =
  | "xxs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl"
  | "2xl"
  | "3xl";

export type DefaultIconSizeKey = "xs" | "sm" | "md" | "lg" | "xl";

export type DefaultSizeKey = "buttonHeight" | "inputHeight";

export type DefaultTextVariantKey =
  | "caption"
  | "label"
  | "body"
  | "bodyLarge"
  | "title"
  | "heading"
  | "display";

type LegacyLayoutInput = {
  /** @deprecated 2.0: use `spacing.screen`. */
  horizontalPadding?: Responsive<number>;
  /** @deprecated 2.0: use `layout.containerMaxWidth`. */
  contentMaxWidth?: Responsive<number | undefined>;
  /** @deprecated 2.0: use `spacing.gap`. */
  gap?: Responsive<number>;
  /** @deprecated 2.0: use `spacing.section`. */
  sectionGap?: Responsive<number>;
  /** @deprecated 2.0: use `spacing.card`. */
  cardPadding?: Responsive<number>;
  /** @deprecated 2.0: use a `radii` token. */
  borderRadius?: Responsive<number>;
  /** @deprecated 2.0: app-specific; define your own token in `sizes`. */
  actionColumns?: Responsive<number>;
  /** @deprecated 2.0: app-specific; define your own token in `sizes`. */
  statColumns?: Responsive<number>;
  /** @deprecated 2.0: use `sizes.buttonHeight`. */
  buttonHeight?: FluidConfig | TokenValue;
  /** @deprecated 2.0: use `sizes.inputHeight`. */
  inputHeight?: Responsive<number>;
  /** @deprecated 2.0: use `spacing.input`. */
  inputPaddingHorizontal?: Responsive<number>;
  /** @deprecated 2.0: use `iconSizes`. */
  iconSize?: Partial<Record<DefaultIconSizeKey, Responsive<number>>>;
};

export type LayoutInput = {
  /** Max width of ResponsiveContainer's content. `undefined` = no limit. */
  containerMaxWidth?: Responsive<number | undefined>;
} & LegacyLayoutInput;

/**
 * Everything you can configure. Every field is optional and merged over
 * the defaults; per-tier maps merge tier by tier.
 */
export type ResponsiveConfigInput = {
  breakpoints?: BreakpointsInput;
  spacing?: TokenGroup;
  radii?: TokenGroup;
  typography?: TokenGroup;
  iconSizes?: TokenGroup;
  sizes?: TokenGroup;
  text?: Record<string, TextVariant>;
  layout?: LayoutInput;
};

/** @deprecated 2.0: renamed to `ResponsiveConfigInput`. */
export type ResponsiveConfigOverrides = ResponsiveConfigInput;

/** Fully merged config, as held by ResponsiveProvider. */
export type ResponsiveConfig = {
  breakpoints: ResolvedBreakpoints;
  spacing: TokenGroup;
  radii: TokenGroup;
  typography: TokenGroup;
  iconSizes: TokenGroup;
  sizes: TokenGroup;
  text: Record<string, TextVariant>;
  layout: { containerMaxWidth: Responsive<number | undefined> };
  /** Values behind the deprecated 1.x tokens that have no 2.0 equivalent. */
  legacy: {
    borderRadius: Responsive<number>;
    actionColumns: Responsive<number>;
    statColumns: Responsive<number>;
  };
};

/**
 * Register your config to get typed custom tokens everywhere:
 *
 * ```ts
 * const config = defineConfig({ spacing: { hero: 64 } });
 *
 * declare module "@ladiyusuph/responsive-rn" {
 *   interface Register {
 *     config: typeof config;
 *   }
 * }
 * ```
 */
export interface Register {}

type RegisteredConfig = Register extends { config: infer C } ? C : {};

type UserKeys<Group extends string> = RegisteredConfig extends {
  [K in Group]: infer Tokens;
}
  ? Extract<keyof Tokens, string>
  : never;

export type SpacingKey = DefaultSpacingKey | UserKeys<"spacing">;
export type RadiiKey = DefaultRadiiKey | UserKeys<"radii">;
export type TypographyKey = DefaultTypographyKey | UserKeys<"typography">;
export type IconSizeKey = DefaultIconSizeKey | UserKeys<"iconSizes">;
export type SizeKey = DefaultSizeKey | UserKeys<"sizes">;
export type TextVariantKey = DefaultTextVariantKey | UserKeys<"text">;

export type SpacingTokens = Record<SpacingKey, number>;
export type RadiiTokens = Record<RadiiKey, number>;
export type TypographyTokens = Record<TypographyKey, number>;
export type IconSizeTokens = Record<IconSizeKey, number>;
export type SizeTokens = Record<SizeKey, number>;
export type TextVariants = Record<TextVariantKey, ResolvedTextStyle>;

export type Tokens = {
  spacing: SpacingTokens;
  radii: RadiiTokens;
  typography: TypographyTokens;
  iconSizes: IconSizeTokens;
  sizes: SizeTokens;
  text: TextVariants;
  /** ResponsiveContainer's max content width for the current tier. */
  containerMaxWidth: number | undefined;
};

export type BreakpointCondition = {
  /** Match at or above this tier (inclusive). */
  above?: Tier | DeviceType;
  /** Match at or below this tier (inclusive). */
  below?: Tier | DeviceType;
  /** Match only this tier, or one of these tiers. Overrides above/below. */
  only?: Tier | DeviceType | Array<Tier | DeviceType>;
};
