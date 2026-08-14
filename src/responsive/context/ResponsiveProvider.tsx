import React, { createContext, useContext, useMemo } from "react";
import {
  DEFAULT_BREAKPOINTS,
  DEFAULT_LAYOUT,
  DEFAULT_RESPONSIVE_RADII,
  DEFAULT_RESPONSIVE_SPACING,
  DEFAULT_TYPOGRAPHY,
} from "../constants";
import type { ResponsiveConfig, ResponsiveConfigOverrides } from "../types";

const DEFAULT_CONFIG: ResponsiveConfig = {
  breakpoints: DEFAULT_BREAKPOINTS,
  spacing: DEFAULT_RESPONSIVE_SPACING,
  typography: DEFAULT_TYPOGRAPHY,
  radii: DEFAULT_RESPONSIVE_RADII,
  layout: DEFAULT_LAYOUT,
};

const ResponsiveContext = createContext<ResponsiveConfig>(DEFAULT_CONFIG);

function mergeResponsiveValues<T>(
  defaults: Record<string, T | undefined>,
  overrides?: Record<string, T | undefined>,
) {
  return { ...defaults, ...overrides };
}

function mergeResponsiveConfig<T extends Record<string, Record<string, any>>>(
  defaults: T,
  overrides?: Partial<T>,
): T {
  return Object.fromEntries(
    Object.keys(defaults).map((key) => [
      key,
      mergeResponsiveValues(defaults[key], overrides?.[key]),
    ]),
  ) as T;
}

function mergeConfig(overrides?: ResponsiveConfigOverrides): ResponsiveConfig {
  return {
    breakpoints: {
      ...DEFAULT_CONFIG.breakpoints,
      ...overrides?.breakpoints,
    },

    spacing: mergeResponsiveConfig(DEFAULT_CONFIG.spacing, overrides?.spacing),

    typography: mergeResponsiveConfig(
      DEFAULT_CONFIG.typography,
      overrides?.typography,
    ),

    radii: mergeResponsiveConfig(DEFAULT_CONFIG.radii, overrides?.radii),

    layout: {
      horizontalPadding: mergeResponsiveValues(
        DEFAULT_CONFIG.layout.horizontalPadding,
        overrides?.layout?.horizontalPadding,
      ),

      contentMaxWidth: mergeResponsiveValues(
        DEFAULT_CONFIG.layout.contentMaxWidth,
        overrides?.layout?.contentMaxWidth,
      ),

      gap: mergeResponsiveValues(
        DEFAULT_CONFIG.layout.gap,
        overrides?.layout?.gap,
      ),

      sectionGap: mergeResponsiveValues(
        DEFAULT_CONFIG.layout.sectionGap,
        overrides?.layout?.sectionGap,
      ),

      cardPadding: mergeResponsiveValues(
        DEFAULT_CONFIG.layout.cardPadding,
        overrides?.layout?.cardPadding,
      ),

      borderRadius: mergeResponsiveValues(
        DEFAULT_CONFIG.layout.borderRadius,
        overrides?.layout?.borderRadius,
      ),

      actionColumns: mergeResponsiveValues(
        DEFAULT_CONFIG.layout.actionColumns,
        overrides?.layout?.actionColumns,
      ),

      statColumns: mergeResponsiveValues(
        DEFAULT_CONFIG.layout.statColumns,
        overrides?.layout?.statColumns,
      ),

      buttonHeight: {
        ...DEFAULT_CONFIG.layout.buttonHeight,
        ...overrides?.layout?.buttonHeight,
      },

      inputHeight: mergeResponsiveValues(
        DEFAULT_CONFIG.layout.inputHeight ?? {},
        overrides?.layout?.inputHeight,
      ),

      inputPaddingHorizontal: mergeResponsiveValues(
        DEFAULT_CONFIG.layout.inputPaddingHorizontal ?? {},
        overrides?.layout?.inputPaddingHorizontal,
      ),

      iconSize: mergeResponsiveConfig(
        DEFAULT_CONFIG.layout.iconSize!,
        overrides?.layout?.iconSize,
      ),
    },
  };
}

export function ResponsiveProvider({
  children,
  breakpoints,
  spacing,
  typography,
  radii,
  layout,
  config,
}: {
  children: React.ReactNode;
  breakpoints?: ResponsiveConfigOverrides["breakpoints"];
  spacing?: ResponsiveConfigOverrides["spacing"];
  typography?: ResponsiveConfigOverrides["typography"];
  radii?: ResponsiveConfigOverrides["radii"];
  layout?: ResponsiveConfigOverrides["layout"];
  config?: ResponsiveConfigOverrides;
}) {
  const value = useMemo(
    () =>
      mergeConfig({
        ...config,
        breakpoints: { ...config?.breakpoints, ...breakpoints },
        spacing: { ...config?.spacing, ...spacing },
        typography: { ...config?.typography, ...typography },
        radii: { ...config?.radii, ...radii },
        layout: { ...config?.layout, ...layout },
      }),
    [config, breakpoints, spacing, typography, radii, layout],
  );

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export function useResponsiveConfig() {
  return useContext(ResponsiveContext);
}

export function useResponsiveBreakpoints() {
  return useResponsiveConfig().breakpoints;
}
