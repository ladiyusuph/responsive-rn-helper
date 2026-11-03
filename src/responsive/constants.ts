import type {
  DefaultIconSizeKey,
  DefaultRadiiKey,
  DefaultSizeKey,
  DefaultSpacingKey,
  DefaultTextVariantKey,
  DefaultTypographyKey,
  FluidToken,
  Responsive,
  TextVariant,
  TokenValue,
} from "./types";

export { DEFAULT_BREAKPOINTS, DEFAULT_STACK_BELOW } from "./tiers";

/**
 * Smoothly scales between `min` and `max` as the window grows from `from`
 * (default 320) to `to` (default: the `expanded` breakpoint) — the direct
 * equivalent of CSS clamp(min, <fluid>, max).
 *
 * sizes: { buttonHeight: fluid(48, 56) }
 */
export function fluid(
  min: number,
  max: number,
  range?: { from?: number; to?: number },
): FluidToken {
  return { kind: "fluid", min, max, from: range?.from, to: range?.to };
}

/**
 * SPACING
 * A static 4/8pt scale (xs–xxxl) plus semantic, responsive tokens.
 * - screen: edge padding. 16 on phones (iOS & Android standard), more on tablets.
 * - section: separation between page sections.
 * - card: padding inside cards (Material cards use 16).
 * - gap: space between items in rows and grids.
 * - input: horizontal padding inside text inputs.
 */
export const DEFAULT_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  screen: { compact: 16, medium: 24, expanded: 32 },
  section: { compact: 24, medium: 32, expanded: 40 },
  card: { compact: 16, medium: 20, expanded: 24 },
  gap: { compact: 12, medium: 16, expanded: 24 },
  input: { compact: 16, medium: 20 },
} satisfies Record<DefaultSpacingKey, TokenValue>;

/**
 * RADII
 * 8: chips/tags | 12: buttons | 16: cards | 24+: modals and sheets, which get
 * rounder on bigger screens so they look less boxy.
 */
export const DEFAULT_RADII = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: { compact: 24, medium: 28, expanded: 32 },
} satisfies Record<DefaultRadiiKey, TokenValue>;

/**
 * TYPOGRAPHY (font sizes)
 * Body text doesn't need to grow much on tablets (they're held further
 * away), but headings scale up to fill the space.
 */
export const DEFAULT_TYPOGRAPHY = {
  xxs: 10,
  xs: { compact: 11, medium: 12, expanded: 13 },
  sm: { compact: 12, medium: 13, expanded: 14 },
  md: { compact: 14, medium: 15, expanded: 16 },
  lg: { compact: 16, medium: 18, expanded: 20 },
  xl: { compact: 18, medium: 20, expanded: 22 },
  xxl: { compact: 20, medium: 22, expanded: 24 },
  "2xl": { compact: 22, medium: 28, expanded: 32 },
  "3xl": { compact: 26, medium: 32, expanded: 40 },
} satisfies Record<DefaultTypographyKey, TokenValue>;

/**
 * TEXT VARIANTS
 * Ready-made text styles built on the typography scale. `lineHeight` is a
 * multiplier: tighter for large display text, looser for body copy.
 */
export const DEFAULT_TEXT = {
  caption: { fontSize: "xs", lineHeight: 1.4 },
  label: { fontSize: "sm", lineHeight: 1.4, fontWeight: "500" },
  body: { fontSize: "md", lineHeight: 1.5 },
  bodyLarge: { fontSize: "lg", lineHeight: 1.5 },
  title: { fontSize: "xl", lineHeight: 1.3, fontWeight: "600" },
  heading: { fontSize: "2xl", lineHeight: 1.25, fontWeight: "700" },
  display: { fontSize: "3xl", lineHeight: 1.2, fontWeight: "700" },
} satisfies Record<DefaultTextVariantKey, TextVariant>;

/**
 * ICONS
 * 24x24 is the standard icon bounding box (Material, Apple, web).
 */
export const DEFAULT_ICON_SIZES = {
  xs: { compact: 16, medium: 18, expanded: 20 },
  sm: { compact: 20, medium: 22, expanded: 24 },
  md: { compact: 24, expanded: 28 },
  lg: { compact: 32, medium: 36, expanded: 40 },
  xl: { compact: 40, medium: 48, expanded: 56 },
} satisfies Record<DefaultIconSizeKey, TokenValue>;

/**
 * SIZES
 * Accessible touch targets: Apple HIG requires 44pt, Material 3 and WCAG
 * 2.1 AAA 48dp. Controls should never be shorter than 48 on mobile.
 */
export const DEFAULT_SIZES = {
  buttonHeight: fluid(48, 56, { from: 320, to: 900 }),
  inputHeight: { compact: 48, medium: 52, expanded: 56 },
} satisfies Record<DefaultSizeKey, TokenValue>;

export const DEFAULT_LAYOUT: { containerMaxWidth: Responsive<number | undefined> } = {
  // Keeps long lines readable on wide screens.
  containerMaxWidth: { medium: 800, expanded: 1040 },
};

/** Values behind deprecated 1.x tokens that have no 2.0 equivalent. */
export const DEFAULT_LEGACY_TOKENS = {
  borderRadius: { compact: 16, medium: 24 },
  actionColumns: { compact: 2, expanded: 3 },
  statColumns: { compact: 2, medium: 4 },
};
