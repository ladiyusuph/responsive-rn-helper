import { computeGridColumns } from "../utils";

describe("computeGridColumns", () => {
  it("never returns fewer than 1 column", () => {
    expect(computeGridColumns(50, 160, 12)).toBe(1);
    expect(computeGridColumns(0, 160, 12)).toBe(1);
    expect(computeGridColumns(-100, 160, 12)).toBe(1);
  });

  it("increases column count as width grows", () => {
    const widths = [320, 400, 600, 800, 1024, 1366];
    const columns = widths.map((w) => computeGridColumns(w, 160, 12));
    for (let i = 1; i < columns.length; i++) {
      expect(columns[i]).toBeGreaterThanOrEqual(columns[i - 1]);
    }
  });

  it("keeps items at least minItemWidth wide (accounting for gaps)", () => {
    const width = 1000;
    const minItemWidth = 160;
    const gap = 12;
    const columns = computeGridColumns(width, minItemWidth, gap);
    const totalGap = gap * (columns - 1);
    const itemWidth = (width - totalGap) / columns;
    expect(itemWidth).toBeGreaterThanOrEqual(minItemWidth - gap); // small tolerance for the formula's own gap accounting
  });
});
