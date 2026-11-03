import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { useResponsiveBreakpoints } from "../context/ResponsiveProvider";
import { defineDeprecated } from "../legacy";
import { mergeBreakpoints, tierIndex } from "../tiers";
import {
  computeLegacyFlags,
  computeWindowClass,
  type LegacyBreakpointFlags,
  type WindowClass,
} from "../utils";
import type { BreakpointsInput, ResolvedBreakpoints, Tier } from "../types";

export type ResponsiveState = WindowClass & {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
  breakpoints: ResolvedBreakpoints;
  /** True when the current tier is `tier` or larger. */
  isAtLeast: (tier: Tier) => boolean;
  /** True when the current tier is smaller than `tier`. */
  isBelow: (tier: Tier) => boolean;
} & LegacyBreakpointFlags;

/** Getters for the 1.x flags, shared by useResponsive() and useLayout(). */
export function legacyFlagFields(width: number, breakpoints: ResolvedBreakpoints) {
  const flags = () => computeLegacyFlags(width, breakpoints);

  return {
    isSmallPhone: {
      get: () => flags().isSmallPhone,
      message: "isSmallPhone has no 2.0 equivalent (there's no tier below compact)",
    },
    isPhone: {
      get: () => flags().isPhone,
      message: 'isPhone is now isBelow("medium")',
    },
    isTablet: {
      get: () => flags().isTablet,
      message: 'isTablet is now isAtLeast("medium")',
    },
    isLargeTablet: {
      get: () => flags().isLargeTablet,
      message: 'isLargeTablet is now isAtLeast("expanded")',
    },
    deviceType: {
      get: () => flags().deviceType,
      message: "deviceType is now tier",
    },
  };
}

export function useResponsive(override?: BreakpointsInput): ResponsiveState {
  const { width, height, scale, fontScale } = useWindowDimensions();
  const base = useResponsiveBreakpoints();

  /**
   * Keyed on the numbers rather than the override object, so an inline
   * `useResponsive({ expanded: 900 })` still returns a stable result.
   */
  const breakpoints = useMemo(
    () => mergeBreakpoints(base, override),
    [
      base,
      override?.medium,
      override?.expanded,
      override?.large,
      override?.phone,
      override?.tablet,
      override?.smallPhone,
    ],
  );

  return useMemo(() => {
    const windowClass = computeWindowClass(width, height, breakpoints);
    const currentIndex = tierIndex(windowClass.tier);

    return defineDeprecated<
      Omit<ResponsiveState, keyof LegacyBreakpointFlags>,
      LegacyBreakpointFlags
    >(
      {
        width,
        height,
        scale,
        fontScale,
        ...windowClass,
        breakpoints,
        isAtLeast: (tier) => currentIndex >= tierIndex(tier),
        isBelow: (tier) => currentIndex < tierIndex(tier),
      },
      legacyFlagFields(width, breakpoints),
    );
  }, [width, height, scale, fontScale, breakpoints]);
}
