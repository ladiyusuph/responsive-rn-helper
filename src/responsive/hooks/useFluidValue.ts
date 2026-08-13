import { useResponsive } from "./useResponsive";
import { fluidValue } from "../utils";

/**
 * Smoothly interpolates a value between minValue and maxValue as width goes
 * from minWidth to maxWidth — the direct equivalent of CSS
 * clamp(minValue, <fluid>, maxValue). Unlike useResponsiveValue (which jumps
 * between fixed tiers at breakpoints), this scales continuously, so it's a
 * good fit for things like fluid font sizes or spacing that shouldn't visibly
 * "snap" as the window resizes (e.g. on a foldable or a resizable window).
 *
 * Defaults minWidth/maxWidth to the smallPhone/tablet breakpoints if not
 * given, so `useFluidValue(14, 20)` works out of the box.
 */
export function useFluidValue(
  minValue: number,
  maxValue: number,
  options?: { minWidth?: number; maxWidth?: number },
): number {
  const { width, breakpoints } = useResponsive();
  const minWidth = options?.minWidth ?? breakpoints.smallPhone;
  const maxWidth = options?.maxWidth ?? breakpoints.tablet;

  return fluidValue(width, { minWidth, maxWidth, minValue, maxValue });
}
