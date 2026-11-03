import { defineConfig, normalizeConfig, resolveTokens, resolveTokenValue } from "../config";
import { DEFAULT_BREAKPOINTS, DEFAULT_TYPOGRAPHY, fluid } from "../constants";
import { TIERS } from "../tiers";

const at = (width: number, input?: Parameters<typeof normalizeConfig>[0]) =>
  resolveTokens(normalizeConfig(input), width);

const TIER_WIDTHS = [390, 700, 1000, 1366];

describe("default tokens", () => {
  it("resolves semantic spacing per tier", () => {
    expect(at(390).spacing).toMatchObject({ screen: 16, section: 24, card: 16, gap: 12, input: 16 });
    expect(at(700).spacing).toMatchObject({ screen: 24, section: 32, card: 20, gap: 16, input: 20 });
    expect(at(1000).spacing).toMatchObject({ screen: 32, section: 40, card: 24, gap: 24 });
  });

  it("includes the static spacing scale", () => {
    expect(at(1366).spacing).toMatchObject({ xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 });
  });

  it("never shrinks a font size as the screen gets larger", () => {
    for (const key of Object.keys(DEFAULT_TYPOGRAPHY)) {
      const sizes = TIER_WIDTHS.map((width) => (at(width).typography as Record<string, number>)[key]);
      expect(sizes).toEqual([...sizes].sort((a, b) => a - b));
    }
  });

  it("keeps the type scale ordered within each tier (xxs < ... < 3xl)", () => {
    for (const width of TIER_WIDTHS) {
      const sizes = Object.values(at(width).typography);
      expect(sizes).toEqual([...sizes].sort((a, b) => a - b));
    }
  });

  it("limits container width only from medium up", () => {
    expect(at(390).containerMaxWidth).toBeUndefined();
    expect(at(700).containerMaxWidth).toBe(800);
    expect(at(1366).containerMaxWidth).toBe(1040);
  });

  it("scales button height fluidly", () => {
    expect(at(320).sizes.buttonHeight).toBe(48);
    expect(at(610).sizes.buttonHeight).toBe(52);
    expect(at(1366).sizes.buttonHeight).toBe(56);
  });

  it("resolves text variants with absolute line heights", () => {
    expect(at(390).text.body).toEqual({ fontSize: 14, lineHeight: 21 });
    expect(at(1000).text.heading).toEqual({ fontSize: 32, lineHeight: 40, fontWeight: "700" });
  });
});

describe("normalizeConfig", () => {
  it("merges per-tier maps tier by tier", () => {
    const spacing = at(390, { spacing: { screen: { medium: 30 } } }).spacing;
    expect(spacing.screen).toBe(16);
    expect(at(700, { spacing: { screen: { medium: 30 } } }).spacing.screen).toBe(30);
  });

  it("replaces a token outright with a plain value", () => {
    expect(at(1366, { spacing: { screen: 20 } }).spacing.screen).toBe(20);
  });

  it("adds custom tokens alongside the defaults", () => {
    const tokens = at(700, {
      spacing: { hero: { compact: 48, medium: 64 } },
      sizes: { avatar: 40 },
      text: { button: { fontSize: "md", fontWeight: "600" } },
    });
    expect((tokens.spacing as Record<string, number>).hero).toBe(64);
    expect((tokens.sizes as Record<string, number>).avatar).toBe(40);
    expect((tokens.text as Record<string, object>).button).toEqual({ fontSize: 15, fontWeight: "600" });
    expect(tokens.spacing.screen).toBe(24);
  });

  it("lets text variants use a size instead of a typography token", () => {
    const tokens = at(390, { text: { hero: { fontSize: { compact: 40, medium: 56 }, lineHeight: 1.1 } } });
    expect((tokens.text as Record<string, object>).hero).toEqual({ fontSize: 40, lineHeight: 44 });
  });

  it("applies custom breakpoints", () => {
    expect(at(700, { breakpoints: { medium: 768 } }).spacing.screen).toBe(16);
  });

  describe("1.x config", () => {
    it("maps tier keys inside token values", () => {
      const tokens = at(700, { spacing: { screen: { small: 12, phone: 20, tablet: 28 } } });
      expect(tokens.spacing.screen).toBe(28);
      expect(at(390, { spacing: { screen: { phone: 20 } } }).spacing.screen).toBe(20);
    });

    it("maps layout tokens onto their 2.0 groups", () => {
      const tokens = at(390, {
        layout: {
          horizontalPadding: { phone: 18 },
          cardPadding: 14,
          gap: 10,
          inputHeight: 50,
          iconSize: { md: 26 },
          contentMaxWidth: { phone: 500 },
        },
      });
      expect(tokens.spacing.screen).toBe(18);
      expect(tokens.spacing.card).toBe(14);
      expect(tokens.spacing.gap).toBe(10);
      expect(tokens.sizes.inputHeight).toBe(50);
      expect(tokens.iconSizes.md).toBe(26);
      expect(tokens.containerMaxWidth).toBe(500);
    });

    it("prefers the 2.0 key when both are given", () => {
      const tokens = at(390, { spacing: { screen: 22 }, layout: { horizontalPadding: 18 } });
      expect(tokens.spacing.screen).toBe(22);
    });

    it("converts a 1.x FluidConfig to a fluid token", () => {
      const tokens = at(1366, {
        layout: { buttonHeight: { minWidth: 320, maxWidth: 1000, minValue: 48, maxValue: 60 } },
      });
      expect(tokens.sizes.buttonHeight).toBe(60);
    });
  });
});

describe("resolveTokenValue", () => {
  it("defaults a fluid token's range to 320 → the expanded breakpoint", () => {
    const token = fluid(10, 20);
    expect(resolveTokenValue(token, 320, DEFAULT_BREAKPOINTS)).toBe(10);
    expect(resolveTokenValue(token, 580, DEFAULT_BREAKPOINTS)).toBe(15);
    expect(resolveTokenValue(token, 840, DEFAULT_BREAKPOINTS)).toBe(20);
  });

  it("resolves a tier with no value (and no smaller value) to 0", () => {
    expect(resolveTokenValue({ medium: 8 }, 390, DEFAULT_BREAKPOINTS)).toBe(0);
  });
});

describe("defineConfig", () => {
  it("returns the config unchanged", () => {
    const config = { spacing: { hero: 64 } };
    expect(defineConfig(config)).toBe(config);
  });
});

it("exposes the tiers in order", () => {
  expect(TIERS).toEqual(["compact", "medium", "expanded", "large"]);
});
