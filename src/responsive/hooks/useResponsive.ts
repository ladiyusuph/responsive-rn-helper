import { useWindowDimensions } from "react-native";
import { useResponsiveBreakpoints } from "../context/ResponsiveProvider";
import { computeBreakpointFlags } from "../utils";
import type { Breakpoints } from "../types";

export function useResponsive(override?: Partial<Breakpoints>) {
  const { width, height, scale, fontScale } = useWindowDimensions();
  const defaults = useResponsiveBreakpoints();
  const breakpoints = { ...defaults, ...override };

  const flags = computeBreakpointFlags(width, height, breakpoints);

  return {
    width,
    height,
    scale,
    fontScale,
    ...flags,
    breakpoints,
  };
}
