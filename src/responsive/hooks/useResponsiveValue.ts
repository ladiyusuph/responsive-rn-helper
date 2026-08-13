import { useResponsive } from "./useResponsive";
import { responsiveValue } from "../utils";
import type { Breakpoints, ResponsiveValues } from "../types";

export function useResponsiveValue<T>(
  values: ResponsiveValues<T>,
  fallback: T,
  override?: Partial<Breakpoints>,
): T {
  const { width, breakpoints } = useResponsive(override);
  return responsiveValue(width, values, fallback, breakpoints);
}