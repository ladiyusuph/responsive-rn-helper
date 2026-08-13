import { useMemo } from "react";
import { useResponsive } from "./useResponsive";
import { computeLayoutTokens } from "../utils";

export function useLayout() {
  const responsive = useResponsive();

  return useMemo(() => {
    const tokens = computeLayoutTokens(responsive, responsive.width);
    return { ...responsive, ...tokens };
  }, [responsive]);
}
