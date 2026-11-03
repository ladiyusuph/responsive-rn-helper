import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { useResponsiveBreakpoints } from "../context/ResponsiveProvider";
import { computeBreakpointFlags } from "../utils";
import type { Breakpoints } from "../types";

export function useResponsive(override?: Partial<Breakpoints>) {
  const { width, height, scale, fontScale } = useWindowDimensions();
  const defaults = useResponsiveBreakpoints();

  const smallPhone = override?.smallPhone ?? defaults.smallPhone;
  const phone = override?.phone ?? defaults.phone;
  const tablet = override?.tablet ?? defaults.tablet;

  /**
   * Keyed on the three numbers rather than the override object, so an
   * inline `useResponsive({ tablet: 900 })` still returns a stable result.
   */
  const breakpoints = useMemo(
    () => ({ smallPhone, phone, tablet }),
    [smallPhone, phone, tablet],
  );

  return useMemo(
    () => ({
      width,
      height,
      scale,
      fontScale,
      ...computeBreakpointFlags(width, height, breakpoints),
      breakpoints,
    }),
    [width, height, scale, fontScale, breakpoints],
  );
}
