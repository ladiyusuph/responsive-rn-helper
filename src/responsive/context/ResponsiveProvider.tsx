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

function mergeConfig(overrides?: ResponsiveConfigOverrides): ResponsiveConfig {
  return {
    breakpoints: { ...DEFAULT_CONFIG.breakpoints, ...overrides?.breakpoints },
    spacing: {
      screen: mergeResponsiveValues(
        DEFAULT_CONFIG.spacing.screen,
        overrides?.spacing?.screen,
      ),
      section: mergeResponsiveValues(
        DEFAULT_CONFIG.spacing.section,
        overrides?.spacing?.section,
      ),
      card: mergeResponsiveValues(
        DEFAULT_CONFIG.spacing.card,
        overrides?.spacing?.card,
      ),
      gap: mergeResponsiveValues(
        DEFAULT_CONFIG.spacing.gap,
        overrides?.spacing?.gap,
      ),
    },
    typography: Object.fromEntries(
      Object.keys(DEFAULT_CONFIG.typography).map((key) => [
        key,
        mergeResponsiveValues(
          DEFAULT_CONFIG.typography[
            key as keyof typeof DEFAULT_CONFIG.typography
          ],
          overrides?.typography?.[
            key as keyof typeof DEFAULT_CONFIG.typography
          ],
        ),
      ]),
    ) as ResponsiveConfig["typography"],
    radii: Object.fromEntries(
      Object.keys(DEFAULT_CONFIG.radii).map((key) => [
        key,
        mergeResponsiveValues(
          DEFAULT_CONFIG.radii[key as keyof typeof DEFAULT_CONFIG.radii],
          overrides?.radii?.[key as keyof typeof DEFAULT_CONFIG.radii],
        ),
      ]),
    ) as ResponsiveConfig["radii"],
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
