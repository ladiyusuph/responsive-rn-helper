import { fluidValue } from "../utils";

describe("fluidValue", () => {
  const config = { minWidth: 360, maxWidth: 840, minValue: 14, maxValue: 20 };

  it("returns minValue at or below minWidth", () => {
    expect(fluidValue(360, config)).toBe(14);
    expect(fluidValue(200, config)).toBe(14);
  });

  it("returns maxValue at or above maxWidth", () => {
    expect(fluidValue(840, config)).toBe(20);
    expect(fluidValue(2000, config)).toBe(20);
  });

  it("interpolates linearly at the midpoint", () => {
    const midWidth = (config.minWidth + config.maxWidth) / 2;
    const midValue = (config.minValue + config.maxValue) / 2;
    expect(fluidValue(midWidth, config)).toBeCloseTo(midValue);
  });

  it("scales monotonically between the endpoints", () => {
    const widths = [360, 450, 550, 650, 750, 840];
    const values = widths.map((w) => fluidValue(w, config));
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
    }
  });

  it("supports an inverted range (maxValue smaller than minValue)", () => {
    const shrinking = { minWidth: 360, maxWidth: 840, minValue: 20, maxValue: 14 };
    expect(fluidValue(360, shrinking)).toBe(20);
    expect(fluidValue(840, shrinking)).toBe(14);
  });

  it("falls back to maxValue if maxWidth <= minWidth to avoid dividing by zero", () => {
    const degenerate = { minWidth: 500, maxWidth: 500, minValue: 10, maxValue: 30 };
    expect(fluidValue(500, degenerate)).toBe(30);
  });
});
