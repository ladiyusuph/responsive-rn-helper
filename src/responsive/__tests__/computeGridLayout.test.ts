import { computeGridLayout } from "../utils";
import { DEFAULT_BREAKPOINTS } from "../constants";

describe("computeGridLayout", () => {
  it("auto-fits columns and returns the exact item width", () => {
    const layout = computeGridLayout({ width: 393, minItemWidth: 160, gap: 12 });

    expect(layout.numColumns).toBe(2);
    expect(layout.itemWidth).toBe(190.5);
    expect(layout.gap).toBe(12);
  });

  it("fills the width exactly: columns * itemWidth + gaps === width", () => {
    for (const width of [320, 358.6667, 744, 1024]) {
      const { numColumns, itemWidth, gap } = computeGridLayout({
        width,
        minItemWidth: 100,
        gap: 12,
      });

      expect(numColumns * itemWidth + gap * (numColumns - 1)).toBeCloseTo(width);
    }
  });

  it("uses an explicit numeric column count and ignores auto-fit", () => {
    expect(
      computeGridLayout({ width: 1024, columns: 2, minItemWidth: 100 }).numColumns,
    ).toBe(2);
  });

  it("resolves responsive columns per tier", () => {
    const columns = { compact: 2, medium: 3, expanded: 4, large: 6 };
    const at = (width: number) =>
      computeGridLayout({ width, columns, breakpoints: DEFAULT_BREAKPOINTS })
        .numColumns;

    expect(at(390)).toBe(2);
    expect(at(700)).toBe(3);
    expect(at(1024)).toBe(4);
    expect(at(1366)).toBe(6);
  });

  it("uses an explicit tier for per-tier columns when given", () => {
    // ResponsiveGrid passes the screen's tier while width is the container's.
    expect(
      computeGridLayout({ width: 560, columns: { compact: 2, medium: 3 }, tier: "medium" })
        .numColumns,
    ).toBe(3);
  });

  it("still accepts 1.x keys in per-tier columns", () => {
    expect(
      computeGridLayout({ width: 700, columns: { phone: 2, tablet: 3 } }).numColumns,
    ).toBe(3);
  });

  it("clamps auto-fit to minColumns / maxColumns", () => {
    expect(
      computeGridLayout({ width: 1200, minItemWidth: 100, maxColumns: 3 })
        .numColumns,
    ).toBe(3);
    expect(
      computeGridLayout({ width: 200, minItemWidth: 160, minColumns: 2 })
        .numColumns,
    ).toBe(2);
  });

  it("never returns a negative item width", () => {
    expect(computeGridLayout({ width: 0, columns: 3 }).itemWidth).toBe(0);
  });
});
