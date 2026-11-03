import { useMemo } from "react";
import { useResponsive, legacyFlagFields, type ResponsiveState } from "./useResponsive";
import { useResponsiveConfig } from "../context/ResponsiveProvider";
import { resolveTokens, resolveTokenValue } from "../config";
import { defineDeprecated } from "../legacy";
import type { IconSizeTokens, Tokens } from "../types";

/** 1.x flat tokens, still readable (deprecated) on useLayout(). */
export type LegacyLayoutTokens = {
  /** @deprecated 2.0: use `spacing.screen`. */
  horizontalPadding: number;
  /** @deprecated 2.0: use `containerMaxWidth`. */
  contentMaxWidth: number | undefined;
  /** @deprecated 2.0: use `spacing.gap`. */
  gap: number;
  /** @deprecated 2.0: use `spacing.section`. */
  sectionGap: number;
  /** @deprecated 2.0: use `spacing.card`. */
  cardPadding: number;
  /** @deprecated 2.0: use a `radii` token. */
  borderRadius: number;
  /** @deprecated 2.0: define your own token in `sizes`. */
  actionColumns: number;
  /** @deprecated 2.0: define your own token in `sizes`. */
  statColumns: number;
  /** @deprecated 2.0: use `sizes.buttonHeight`. */
  buttonHeight: number;
  /** @deprecated 2.0: use `sizes.inputHeight`. */
  inputHeight: number;
  /** @deprecated 2.0: use `spacing.input`. */
  inputPaddingHorizontal: number;
  /** @deprecated 2.0: use `iconSizes`. */
  iconSize: IconSizeTokens;
};

export type Layout = ResponsiveState & Tokens & LegacyLayoutTokens;

/**
 * Everything in one object: window info (`width`, `tier`, `formFactor`,
 * ...) plus every design token resolved for the current tier.
 *
 * ```tsx
 * const layout = useLayout();
 * <View style={{ padding: layout.spacing.card, borderRadius: layout.radii.lg }} />
 * ```
 */
export function useLayout(): Layout {
  // One window-dimensions subscription for the whole bundle.
  const responsive = useResponsive();
  const config = useResponsiveConfig();

  return useMemo(() => {
    const { width, breakpoints } = responsive;
    const tokens = resolveTokens(config, width);
    const legacy = (value: typeof config.legacy.borderRadius) =>
      resolveTokenValue(value, width, breakpoints);

    // Spreading `responsive` copies only its enumerable 2.0 fields; the
    // deprecated getters are re-attached below.
    return defineDeprecated<ResponsiveState & Tokens, LegacyLayoutTokens>(
      { ...responsive, ...tokens },
      {
        ...legacyFlagFields(width, breakpoints),
        horizontalPadding: {
          get: () => tokens.spacing.screen,
          message: "layout.horizontalPadding is now layout.spacing.screen",
        },
        contentMaxWidth: {
          get: () => tokens.containerMaxWidth,
          message: "layout.contentMaxWidth is now layout.containerMaxWidth",
        },
        gap: {
          get: () => tokens.spacing.gap,
          message: "layout.gap is now layout.spacing.gap",
        },
        sectionGap: {
          get: () => tokens.spacing.section,
          message: "layout.sectionGap is now layout.spacing.section",
        },
        cardPadding: {
          get: () => tokens.spacing.card,
          message: "layout.cardPadding is now layout.spacing.card",
        },
        borderRadius: {
          get: () => legacy(config.legacy.borderRadius),
          message: "layout.borderRadius is now a radii token, e.g. layout.radii.lg",
        },
        actionColumns: {
          get: () => legacy(config.legacy.actionColumns),
          message: "layout.actionColumns is app-specific; define your own token in sizes",
        },
        statColumns: {
          get: () => legacy(config.legacy.statColumns),
          message: "layout.statColumns is app-specific; define your own token in sizes",
        },
        buttonHeight: {
          get: () => tokens.sizes.buttonHeight,
          message: "layout.buttonHeight is now layout.sizes.buttonHeight",
        },
        inputHeight: {
          get: () => tokens.sizes.inputHeight,
          message: "layout.inputHeight is now layout.sizes.inputHeight",
        },
        inputPaddingHorizontal: {
          get: () => tokens.spacing.input,
          message: "layout.inputPaddingHorizontal is now layout.spacing.input",
        },
        iconSize: {
          get: () => tokens.iconSizes,
          message: "layout.iconSize is now layout.iconSizes",
        },
      },
    ) as Layout;
  }, [responsive, config]);
}
