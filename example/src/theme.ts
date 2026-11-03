import { defineConfig } from "@ladiyusuph/responsive-rn";

/**
 * The example's design system: the library defaults plus a few custom
 * tokens. Registering the type below makes `spacing.hero`, `sizes.avatar`,
 * `text.overline`, ... autocomplete everywhere.
 */
export const config = defineConfig({
  spacing: {
    hero: { compact: 32, medium: 48, expanded: 64 },
  },
  radii: {
    pill: 999,
  },
  sizes: {
    avatar: { compact: 56, medium: 72 },
    tabBarHeight: 56,
    sideNavWidth: { expanded: 220, large: 260 },
  },
  text: {
    overline: {
      fontSize: "xs",
      fontWeight: "700",
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    button: { fontSize: "md", lineHeight: 1.2, fontWeight: "600" },
  },
});

declare module "@ladiyusuph/responsive-rn" {
  interface Register {
    config: typeof config;
  }
}

export const colors = {
  background: "#F4F5F7",
  surface: "#FFFFFF",
  text: "#14161A",
  muted: "#5E6470",
  border: "#E2E4E9",
  primary: "#3557E0",
  primaryText: "#FFFFFF",
  primarySoft: "#E3E9FC",
  tiers: {
    compact: "#2E9E6B",
    medium: "#D98A1E",
    expanded: "#7A4FD6",
    large: "#D2475E",
  },
} as const;
