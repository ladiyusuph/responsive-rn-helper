import { useMemo } from "react";
import { useResponsiveConfig } from "../context/ResponsiveProvider";
import { useResponsive } from "./useResponsive";
import {
  groupHasFluid,
  isFluidToken,
  resolveTextVariants,
  resolveTokenGroup,
} from "../config";
import type {
  IconSizeKey,
  RadiiKey,
  ResponsiveConfig,
  SizeKey,
  SpacingKey,
  TextVariants,
  TokenGroup,
  TypographyKey,
} from "../types";

/**
 * Resolves one token group. Tokens only change when the tier does, unless
 * the group contains fluid tokens, which track every width change.
 */
function useTokenGroup<K extends string>(
  pick: (config: ResponsiveConfig) => TokenGroup,
): Record<K, number> {
  const config = useResponsiveConfig();
  const { width, tier } = useResponsive();
  const group = pick(config);
  const hasFluid = useMemo(() => groupHasFluid(group), [group]);
  const widthKey = hasFluid ? width : tier;

  return useMemo(
    () => resolveTokenGroup<K>(group, width, config.breakpoints),
    [group, widthKey, config.breakpoints],
  );
}

export function useResponsiveSpacing() {
  return useTokenGroup<SpacingKey>((config) => config.spacing);
}

export function useResponsiveTypography() {
  return useTokenGroup<TypographyKey>((config) => config.typography);
}

export function useResponsiveRadii() {
  return useTokenGroup<RadiiKey>((config) => config.radii);
}

/**
 * Access responsive icon-size tokens directly, without pulling in the rest
 * of useLayout()'s bundle.
 *
 * ```tsx
 * const icons = useResponsiveIconSizes();
 * icons.md;
 * icons.lg;
 * ```
 */
export function useResponsiveIconSizes() {
  return useTokenGroup<IconSizeKey>((config) => config.iconSizes);
}

export function useResponsiveSizes() {
  return useTokenGroup<SizeKey>((config) => config.sizes);
}

/**
 * Text variants (fontSize + lineHeight + weight) for the current tier.
 *
 * ```tsx
 * const text = useTextVariants();
 * <Text style={text.heading}>Welcome</Text>
 * ```
 */
export function useTextVariants(): TextVariants {
  const config = useResponsiveConfig();
  const { width } = useResponsive();
  const typography = useResponsiveTypography();
  const hasFluid = useMemo(
    () => Object.values(config.text).some((variant) => isFluidToken(variant.fontSize)),
    [config.text],
  );
  const widthKey = hasFluid ? width : 0;

  // `typography` already changes identity whenever its values change.
  return useMemo(
    () =>
      resolveTextVariants(config.text, typography, width, config.breakpoints) as TextVariants,
    [config.text, typography, widthKey, config.breakpoints],
  );
}
