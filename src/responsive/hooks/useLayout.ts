import { useMemo } from "react";
import { useResponsive } from "./useResponsive";
import { useResponsiveConfig } from "../context/ResponsiveProvider";
import {
  computeLayoutTokens,
  computeRadiiTokens,
  computeSpacingTokens,
  computeTypographyTokens,
} from "../utils";

export function useLayout() {
  // One window-dimensions subscription for the whole bundle, rather than
  // one per token (which the individual token hooks would each add).
  const responsive = useResponsive();
  const { layout, spacing, radii, typography } = useResponsiveConfig();
  const { width, breakpoints } = responsive;

  return useMemo(
    () => ({
      ...responsive,
      ...computeLayoutTokens(responsive, width, layout, breakpoints),
      spacing: computeSpacingTokens(width, spacing, breakpoints),
      radii: computeRadiiTokens(width, radii, breakpoints),
      typography: computeTypographyTokens(width, typography, breakpoints),
    }),
    [responsive, width, breakpoints, layout, spacing, radii, typography],
  );
}
