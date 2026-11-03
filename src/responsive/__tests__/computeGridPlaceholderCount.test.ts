import { computeGridPlaceholderCount } from "../utils";

describe("computeGridPlaceholderCount", () => {
  it("fills a short last row up to the column count", () => {
    expect(computeGridPlaceholderCount(6, 4, false)).toBe(2);
    expect(computeGridPlaceholderCount(1, 3, false)).toBe(2);
  });

  it("adds nothing when the last row is already full", () => {
    expect(computeGridPlaceholderCount(8, 4, false)).toBe(0);
    expect(computeGridPlaceholderCount(5, 1, false)).toBe(0);
  });

  it("adds nothing with stretchLastRow, so last-row items share the row", () => {
    expect(computeGridPlaceholderCount(6, 4, true)).toBe(0);
  });

  it("adds nothing for an empty grid", () => {
    expect(computeGridPlaceholderCount(0, 4, false)).toBe(0);
  });
});
