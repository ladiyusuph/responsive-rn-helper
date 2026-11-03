import {
  computeIconSizeTokens,
  computeRadiiTokens,
  computeSpacingTokens,
  computeTypographyTokens,
} from "../utils";
import {
  DEFAULT_BREAKPOINTS,
  DEFAULT_LAYOUT,
  DEFAULT_RESPONSIVE_RADII,
  DEFAULT_RESPONSIVE_SPACING,
  DEFAULT_TYPOGRAPHY,
} from "../constants";

const bp = DEFAULT_BREAKPOINTS;
const TIER_WIDTHS = [300, 390, 700, 1024];

describe("computeSpacingTokens", () => {
  it("resolves each spacing token for the current tier", () => {
    expect(computeSpacingTokens(390, DEFAULT_RESPONSIVE_SPACING, bp)).toEqual({
      screen: 16,
      section: 24,
      card: 16,
      gap: 12,
    });
    expect(computeSpacingTokens(1024, DEFAULT_RESPONSIVE_SPACING, bp).screen).toBe(32);
  });
});

describe("computeTypographyTokens", () => {
  it("resolves every size key", () => {
    const tokens = computeTypographyTokens(390, DEFAULT_TYPOGRAPHY, bp);

    expect(Object.keys(tokens)).toEqual(Object.keys(DEFAULT_TYPOGRAPHY));
    expect(tokens.md).toBe(14);
  });

  it("never shrinks a default size as the screen gets larger", () => {
    for (const key of Object.keys(DEFAULT_TYPOGRAPHY) as Array<
      keyof typeof DEFAULT_TYPOGRAPHY
    >) {
      const sizes = TIER_WIDTHS.map(
        (width) => computeTypographyTokens(width, DEFAULT_TYPOGRAPHY, bp)[key],
      );

      expect(sizes).toEqual([...sizes].sort((a, b) => a - b));
    }
  });

  it("keeps the default scale ordered within each tier (xxs < ... < 3xl)", () => {
    for (const width of TIER_WIDTHS) {
      const sizes = Object.values(
        computeTypographyTokens(width, DEFAULT_TYPOGRAPHY, bp),
      );

      expect(sizes).toEqual([...sizes].sort((a, b) => a - b));
    }
  });
});

describe("computeRadiiTokens", () => {
  it("rounds modals more on larger screens", () => {
    expect(computeRadiiTokens(390, DEFAULT_RESPONSIVE_RADII, bp).xxl).toBe(24);
    expect(computeRadiiTokens(1024, DEFAULT_RESPONSIVE_RADII, bp).xxl).toBe(32);
  });
});

describe("computeIconSizeTokens", () => {
  it("resolves icon sizes from the layout config", () => {
    expect(computeIconSizeTokens(700, DEFAULT_LAYOUT.iconSize, bp)).toEqual({
      xs: 18,
      sm: 22,
      md: 24,
      lg: 36,
      xl: 48,
    });
  });
});
