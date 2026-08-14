import { computeBreakpointFlags, computeLayoutTokens } from "../utils";
import { DEFAULT_BREAKPOINTS, DEFAULT_LAYOUT } from "../constants";

function layoutForWidth(width: number, height = 900) {
  const flags = computeBreakpointFlags(width, height, DEFAULT_BREAKPOINTS);

  return computeLayoutTokens(flags, width, DEFAULT_LAYOUT, DEFAULT_BREAKPOINTS);
}

describe("computeLayoutTokens", () => {
  describe("horizontalPadding", () => {
    it("returns the correct value for each responsive tier", () => {
      expect(layoutForWidth(320).horizontalPadding).toBe(12);
      expect(layoutForWidth(390).horizontalPadding).toBe(16);
      expect(layoutForWidth(700).horizontalPadding).toBe(24);
      expect(layoutForWidth(1024).horizontalPadding).toBe(32);
    });

    it("gives large tablets more horizontal padding than tablets", () => {
      const tablet = layoutForWidth(700);
      const largeTablet = layoutForWidth(1024);

      expect(largeTablet.horizontalPadding).toBeGreaterThan(
        tablet.horizontalPadding,
      );
    });
  });

  describe("contentMaxWidth", () => {
    it("does not constrain small phones or phones", () => {
      expect(layoutForWidth(320).contentMaxWidth).toBeUndefined();
      expect(layoutForWidth(390).contentMaxWidth).toBeUndefined();
    });

    it("applies the tablet max width", () => {
      expect(layoutForWidth(700).contentMaxWidth).toBe(800);
    });

    it("applies the large-tablet max width", () => {
      expect(layoutForWidth(1024).contentMaxWidth).toBe(1000);
    });
  });

  describe("spacing", () => {
    it("returns the correct responsive gap", () => {
      expect(layoutForWidth(320).gap).toBe(8);
      expect(layoutForWidth(390).gap).toBe(12);
      expect(layoutForWidth(700).gap).toBe(16);
      expect(layoutForWidth(1024).gap).toBe(20);
    });

    it("returns the correct section gap", () => {
      expect(layoutForWidth(320).sectionGap).toBe(16);
      expect(layoutForWidth(390).sectionGap).toBe(20);
      expect(layoutForWidth(700).sectionGap).toBe(24);
      expect(layoutForWidth(1024).sectionGap).toBe(28);
    });

    it("returns the correct card padding", () => {
      expect(layoutForWidth(320).cardPadding).toBe(12);
      expect(layoutForWidth(390).cardPadding).toBe(16);
      expect(layoutForWidth(700).cardPadding).toBe(20);
      expect(layoutForWidth(1024).cardPadding).toBe(24);
    });
  });

  describe("borderRadius", () => {
    it("returns the correct responsive radius", () => {
      expect(layoutForWidth(320).borderRadius).toBe(16);
      expect(layoutForWidth(390).borderRadius).toBe(20);
      expect(layoutForWidth(700).borderRadius).toBe(24);
      expect(layoutForWidth(1024).borderRadius).toBe(24);
    });
  });

  describe("columns", () => {
    it("returns the expected action columns", () => {
      expect(layoutForWidth(320).actionColumns).toBe(1);
      expect(layoutForWidth(390).actionColumns).toBe(2);
      expect(layoutForWidth(700).actionColumns).toBe(2);
      expect(layoutForWidth(1024).actionColumns).toBe(3);
    });

    it("returns the expected stat columns", () => {
      expect(layoutForWidth(320).statColumns).toBe(1);
      expect(layoutForWidth(390).statColumns).toBe(2);
      expect(layoutForWidth(700).statColumns).toBe(2);
      expect(layoutForWidth(1024).statColumns).toBe(4);
    });

    it("gives large tablets more columns than tablets", () => {
      const tablet = layoutForWidth(700);
      const largeTablet = layoutForWidth(1024);

      expect(largeTablet.actionColumns).toBeGreaterThan(tablet.actionColumns);

      expect(largeTablet.statColumns).toBeGreaterThan(tablet.statColumns);
    });
  });

  describe("buttonHeight", () => {
    it("clamps the value to the configured minimum", () => {
      expect(layoutForWidth(200).buttonHeight).toBe(48);
    });

    it("clamps the value to the configured maximum", () => {
      expect(layoutForWidth(2000).buttonHeight).toBe(56);
    });

    it("stays within the configured range", () => {
      const value = layoutForWidth(390).buttonHeight;

      expect(value).toBeGreaterThanOrEqual(48);
      expect(value).toBeLessThanOrEqual(56);
    });
  });

  describe("input", () => {
    it("returns the correct responsive input height", () => {
      expect(layoutForWidth(320).inputHeight).toBe(44);
      expect(layoutForWidth(390).inputHeight).toBe(46);
      expect(layoutForWidth(700).inputHeight).toBe(50);
      expect(layoutForWidth(1024).inputHeight).toBe(52);
    });

    it("returns the correct responsive horizontal input padding", () => {
      expect(layoutForWidth(320).inputPaddingHorizontal).toBe(12);
      expect(layoutForWidth(390).inputPaddingHorizontal).toBe(14);
      expect(layoutForWidth(700).inputPaddingHorizontal).toBe(16);
      expect(layoutForWidth(1024).inputPaddingHorizontal).toBe(18);
    });
  });

  describe("iconSize", () => {
    it("returns the correct responsive small icon size", () => {
      expect(layoutForWidth(320).iconSize.xs).toBe(12);
      expect(layoutForWidth(390).iconSize.xs).toBe(14);
      expect(layoutForWidth(700).iconSize.xs).toBe(16);
      expect(layoutForWidth(1024).iconSize.xs).toBe(18);
    });

    it("returns the correct responsive medium icon size", () => {
      expect(layoutForWidth(320).iconSize.md).toBe(20);
      expect(layoutForWidth(390).iconSize.md).toBe(22);
      expect(layoutForWidth(700).iconSize.md).toBe(24);
      expect(layoutForWidth(1024).iconSize.md).toBe(26);
    });

    it("returns the correct responsive large icon size", () => {
      expect(layoutForWidth(320).iconSize.lg).toBe(24);
      expect(layoutForWidth(390).iconSize.lg).toBe(26);
      expect(layoutForWidth(700).iconSize.lg).toBe(28);
      expect(layoutForWidth(1024).iconSize.lg).toBe(30);
    });

    it("increases icon sizes across larger device tiers", () => {
      const small = layoutForWidth(320);
      const phone = layoutForWidth(390);
      const tablet = layoutForWidth(700);
      const largeTablet = layoutForWidth(1024);

      expect(phone.iconSize.md).toBeGreaterThan(small.iconSize.md);
      expect(tablet.iconSize.md).toBeGreaterThan(phone.iconSize.md);
      expect(largeTablet.iconSize.md).toBeGreaterThan(tablet.iconSize.md);
    });
  });
});
