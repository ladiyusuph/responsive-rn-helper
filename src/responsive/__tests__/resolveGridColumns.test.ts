import { computeGridColumns, normalizeColumnCount, resolveGridColumns } from "../utils";

describe("resolveGridColumns", () => {
  it("enforces minColumns even when maxColumns is not provided", () => {
    // Regression test: the previous inline formula
    // `Math.min(maxColumns ?? calculated, Math.max(calculated, minColumns))`
    // always collapsed back to `calculated`, silently ignoring minColumns
    // whenever maxColumns was undefined.
    const calculated = computeGridColumns(300, 160, 12); // → 1
    expect(calculated).toBe(1);

    expect(resolveGridColumns(calculated, 2, undefined)).toBe(2);
    expect(resolveGridColumns(calculated, 3, undefined)).toBe(3);
  });

  it("enforces minColumns when maxColumns is also provided", () => {
    const calculated = computeGridColumns(300, 160, 12); // → 1
    expect(resolveGridColumns(calculated, 2, 4)).toBe(2);
  });

  it("caps at maxColumns even when well above minColumns", () => {
    const calculated = computeGridColumns(2000, 160, 12); // large
    expect(resolveGridColumns(calculated, 1, 4)).toBe(4);
  });

  it("leaves the calculated value untouched when within [minColumns, maxColumns]", () => {
    const calculated = computeGridColumns(1000, 160, 12);
    expect(resolveGridColumns(calculated, 1, undefined)).toBe(calculated);
    expect(resolveGridColumns(calculated, 1, calculated + 5)).toBe(calculated);
  });

  it("lets minColumns win over a contradictory (too-low) maxColumns", () => {
    expect(resolveGridColumns(1, 4, 2)).toBe(4);
  });
});

describe("normalizeColumnCount", () => {
  it("rounds to the nearest whole number", () => {
    expect(normalizeColumnCount(2.4)).toBe(2);
    expect(normalizeColumnCount(2.6)).toBe(3);
  });

  it("floors at 1 for zero, negative, or otherwise invalid values", () => {
    expect(normalizeColumnCount(0)).toBe(1);
    expect(normalizeColumnCount(-3)).toBe(1);
  });

  it("passes through already-valid integers unchanged", () => {
    expect(normalizeColumnCount(4)).toBe(4);
  });
});
