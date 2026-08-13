import React, { createContext, useContext, useMemo } from "react";
import { DEFAULT_BREAKPOINTS } from "../constants";
import type { Breakpoints } from "../types";

const ResponsiveContext = createContext<Breakpoints>(DEFAULT_BREAKPOINTS);

export function ResponsiveProvider({
  children,
  breakpoints,
}: {
  children: React.ReactNode;
  breakpoints?: Partial<Breakpoints>;
}) {
  const value = useMemo(
    () => ({ ...DEFAULT_BREAKPOINTS, ...breakpoints }),
    [breakpoints?.smallPhone, breakpoints?.phone, breakpoints?.tablet],
  );

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export function useResponsiveBreakpoints() {
  return useContext(ResponsiveContext);
}