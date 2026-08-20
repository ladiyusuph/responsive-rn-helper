import { useMemo } from "react";
import { useResponsive } from "./useResponsive";
import { useResponsiveSpacing } from "./useResponsiveSpacing";
import { useResponsiveRadii } from "./useResponsiveRadii";
import { useResponsiveTypography } from "./useResponsiveTypography";
import { useResponsiveConfig } from "../context/ResponsiveProvider";
import { computeLayoutTokens } from "../utils";

export function useLayout() {
  const responsive = useResponsive();
  const { layout } = useResponsiveConfig();
  const spacing = useResponsiveSpacing();
  const radii = useResponsiveRadii();
  const typography = useResponsiveTypography();

  return useMemo(
    () => ({
      ...responsive,
      ...computeLayoutTokens(
        responsive,
        responsive.width,
        layout,
        responsive.breakpoints,
      ),
      spacing,
      radii,
      typography,
    }),
    [responsive, layout, spacing, radii, typography],
  );
}
