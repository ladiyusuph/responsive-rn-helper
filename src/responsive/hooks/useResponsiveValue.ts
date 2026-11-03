import { useResponsive } from "./useResponsive";
import { resolveResponsive } from "../tiers";
import type { BreakpointsInput, Responsive } from "../types";

/**
 * Picks the value for the current tier, mobile-first: the tier's own
 * value, else the nearest smaller tier's, else `fallback`.
 *
 * ```tsx
 * const columns = useResponsiveValue({ compact: 1, medium: 2, expanded: 3 }, 1);
 * ```
 */
export function useResponsiveValue<T>(
  values: Responsive<T>,
  fallback: T,
  override?: BreakpointsInput,
): T;
export function useResponsiveValue<T>(values: Responsive<T>): T | undefined;
export function useResponsiveValue<T>(
  values: Responsive<T>,
  fallback?: T,
  override?: BreakpointsInput,
): T | undefined {
  const { tier } = useResponsive(override);
  return resolveResponsive(values, tier, fallback as T);
}
