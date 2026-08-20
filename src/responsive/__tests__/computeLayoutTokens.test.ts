import { computeBreakpointFlags, computeLayoutTokens } from "../utils";
import { DEFAULT_BREAKPOINTS, DEFAULT_LAYOUT } from "../constants";

function layoutForWidth(width: number, height = 900) {
  const flags = computeBreakpointFlags(width, height, DEFAULT_BREAKPOINTS);

  return computeLayoutTokens(flags, width, DEFAULT_LAYOUT, DEFAULT_BREAKPOINTS);
}

describe("computeLayoutTokens", () => {
  describe("horizontalPadding", () => {
    it("returns the correct value for each responsive tier", () => {
      expect(layoutForWidth(320).horizontalPadding).toBe(16);
      expect(layoutForWidth(390).horizontalPadding).toBe(16);
      expect(layoutForWidth(700).horizontalPadding).toBe(24);
      expect(layoutForWidth(1024).horizontalPadding).toBe(32);
    });
  });

  describe("contentMaxWidth", () => {
    it("applies the large-tablet max width", () => {
      expect(layoutForWidth(1024).contentMaxWidth).toBe(1040);
    });
  });

  describe("spacing", () => {
    it("returns the correct responsive gap", () => {
      expect(layoutForWidth(320).gap).toBe(8);
      expect(layoutForWidth(390).gap).toBe(12);
      expect(layoutForWidth(700).gap).toBe(16);
      expect(layoutForWidth(1024).gap).toBe(24);
    });

    it("returns the correct section gap", () => {
      expect(layoutForWidth(320).sectionGap).toBe(24);
      expect(layoutForWidth(390).sectionGap).toBe(24);
      expect(layoutForWidth(700).sectionGap).toBe(32);
      expect(layoutForWidth(1024).sectionGap).toBe(40);
    });

    it("returns the correct card padding", () => {
      expect(layoutForWidth(320).cardPadding).toBe(16);
      expect(layoutForWidth(390).cardPadding).toBe(16);
      expect(layoutForWidth(700).cardPadding).toBe(20);
      expect(layoutForWidth(1024).cardPadding).toBe(24);
    });
  });

  describe("borderRadius", () => {
    it("returns the correct responsive radius", () => {
      expect(layoutForWidth(320).borderRadius).toBe(16);
      expect(layoutForWidth(390).borderRadius).toBe(16);
      expect(layoutForWidth(700).borderRadius).toBe(24);
      expect(layoutForWidth(1024).borderRadius).toBe(24);
    });
  });

  describe("columns", () => {
    it("returns the expected stat columns", () => {
      expect(layoutForWidth(320).statColumns).toBe(1);
      expect(layoutForWidth(390).statColumns).toBe(2);
      expect(layoutForWidth(700).statColumns).toBe(4);
      expect(layoutForWidth(1024).statColumns).toBe(4);
    });

    it("gives large tablets more columns than tablets", () => {
      const small = layoutForWidth(320);
      const phone = layoutForWidth(390);
      const tablet = layoutForWidth(700);
      const largeTablet = layoutForWidth(1024);

      expect(largeTablet.actionColumns).toBeGreaterThan(tablet.actionColumns);

      // statColumns now maxes out at 4 for both tablet and largeTablet
      expect(tablet.statColumns).toBeGreaterThan(phone.statColumns);
      expect(largeTablet.statColumns).toBe(tablet.statColumns);
    });
  });

  describe("input", () => {
    it("returns the correct responsive input height", () => {
      expect(layoutForWidth(320).inputHeight).toBe(48);
      expect(layoutForWidth(390).inputHeight).toBe(48);
      expect(layoutForWidth(700).inputHeight).toBe(52);
      expect(layoutForWidth(1024).inputHeight).toBe(56);
    });

    it("returns the correct responsive horizontal input padding", () => {
      expect(layoutForWidth(320).inputPaddingHorizontal).toBe(16);
      expect(layoutForWidth(390).inputPaddingHorizontal).toBe(16);
      expect(layoutForWidth(700).inputPaddingHorizontal).toBe(20);
      expect(layoutForWidth(1024).inputPaddingHorizontal).toBe(20);
    });
  });

  describe("iconSize", () => {
    it("returns the correct responsive small icon size", () => {
      expect(layoutForWidth(320).iconSize.xs).toBe(16);
      expect(layoutForWidth(390).iconSize.xs).toBe(16);
      expect(layoutForWidth(700).iconSize.xs).toBe(18);
      expect(layoutForWidth(1024).iconSize.xs).toBe(20);
    });

    it("returns the correct responsive medium icon size", () => {
      expect(layoutForWidth(320).iconSize.md).toBe(24);
      expect(layoutForWidth(390).iconSize.md).toBe(24);
      expect(layoutForWidth(700).iconSize.md).toBe(24);
      expect(layoutForWidth(1024).iconSize.md).toBe(28);
    });

    it("returns the correct responsive large icon size", () => {
      expect(layoutForWidth(320).iconSize.lg).toBe(32);
      expect(layoutForWidth(390).iconSize.lg).toBe(32);
      expect(layoutForWidth(700).iconSize.lg).toBe(36);
      expect(layoutForWidth(1024).iconSize.lg).toBe(40);
    });

    it("increases icon sizes across larger device tiers", () => {
      const small = layoutForWidth(320);
      const phone = layoutForWidth(390);
      const tablet = layoutForWidth(700);
      const largeTablet = layoutForWidth(1024);

      // 'md' icons stay firmly at 24px across all mobile/tablet sizes
      // to maintain the standard 24x24 bounding box. They only scale up on large desktops.
      expect(phone.iconSize.md).toBe(small.iconSize.md);
      expect(tablet.iconSize.md).toBe(phone.iconSize.md);
      expect(largeTablet.iconSize.md).toBeGreaterThan(tablet.iconSize.md);
    });
  });
});
