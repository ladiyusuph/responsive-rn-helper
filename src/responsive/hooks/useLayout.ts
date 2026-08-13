import { useMemo } from "react";
import { useResponsive } from "./useResponsive";
import { useResponsiveConfig } from "../context/ResponsiveProvider";
import { computeLayoutTokens } from "../utils";

export function useLayout() {
  const responsive = useResponsive();
  const { layout } = useResponsiveConfig();

  return useMemo(
    () => ({
      ...responsive,
      ...computeLayoutTokens(
        responsive,
        responsive.width,
        layout,
        responsive.breakpoints,
      ),
    }),
    [responsive, layout],
  );
}
