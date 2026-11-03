import React, { createContext, useContext, useMemo, useRef } from "react";
import { normalizeConfig } from "../config";
import { isDeepEqual } from "../utils";
import type { ResponsiveConfig, ResponsiveConfigInput } from "../types";

const DEFAULT_CONFIG: ResponsiveConfig = normalizeConfig();

const ResponsiveContext = createContext<ResponsiveConfig>(DEFAULT_CONFIG);

export type ResponsiveProviderProps = ResponsiveConfigInput & {
  children: React.ReactNode;
  /**
   * Your whole config in one object (ideally from defineConfig()). The
   * individual props (`spacing`, `breakpoints`, ...) override it per group.
   */
  config?: ResponsiveConfigInput;
};

export function ResponsiveProvider({
  children,
  config,
  breakpoints,
  spacing,
  radii,
  typography,
  iconSizes,
  sizes,
  text,
  layout,
}: ResponsiveProviderProps) {
  const merged = useMemo(
    () =>
      normalizeConfig({
        breakpoints: { ...config?.breakpoints, ...breakpoints },
        spacing: { ...config?.spacing, ...spacing },
        radii: { ...config?.radii, ...radii },
        typography: { ...config?.typography, ...typography },
        iconSizes: { ...config?.iconSizes, ...iconSizes },
        sizes: { ...config?.sizes, ...sizes },
        text: { ...config?.text, ...text },
        layout: { ...config?.layout, ...layout },
      }),
    [config, breakpoints, spacing, radii, typography, iconSizes, sizes, text, layout],
  );

  /**
   * `config={{...}}` written inline is a new object every render. Only hand
   * consumers a new context value when the merged config actually changed,
   * otherwise every hook below the provider re-renders with the parent.
   */
  const stableValue = useRef(merged);
  if (!isDeepEqual(stableValue.current, merged)) {
    stableValue.current = merged;
  }
  const value = stableValue.current;

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export function useResponsiveConfig(): ResponsiveConfig {
  return useContext(ResponsiveContext);
}

export function useResponsiveBreakpoints() {
  return useResponsiveConfig().breakpoints;
}
