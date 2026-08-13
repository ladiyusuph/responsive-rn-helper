import { clamp, responsiveValue } from "../utils";
import { DEFAULT_BREAKPOINTS } from "../constants";

describe("responsiveValue", () => {
  const values = { small: 8, phone: 12, tablet: 16, largeTablet: 24 };

  it("picks the value for each tier, largest threshold first", () => {
    expect(responsiveValue(320, values, 0, DEFAULT_BREAKPOINTS)).toBe(8);
    expect(responsiveValue(500, values, 0, DEFAULT_BREAKPOINTS)).toBe(12);
    expect(responsiveValue(700, values, 0, DEFAULT_BREAKPOINTS)).toBe(16);
    expect(responsiveValue(1024, values, 0, DEFAULT_BREAKPOINTS)).toBe(24);
  });

  it("falls back to a smaller tier's value when a larger tier is unset", () => {
    const partial = { small: 8, tablet: 16 }; // no `phone`, no `largeTablet`
    // width is in the "phone" range, but `phone` isn't set, so it should
    // NOT jump up to `tablet` — it should fall through to `small`.
    expect(responsiveValue(500, partial, 0, DEFAULT_BREAKPOINTS)).toBe(8);
    // width is in the large-tablet range, `largeTablet` isn't set, so it
    // uses the largest defined tier at or below it: `tablet`.
    expect(responsiveValue(1024, partial, 0, DEFAULT_BREAKPOINTS)).toBe(16);
  });

  it("uses fallback when no tier is defined at all", () => {
    expect(responsiveValue(320, {}, 42, DEFAULT_BREAKPOINTS)).toBe(42);
  });
});

describe("clamp", () => {
  it("returns the value when inside the range", () => {
    expect(clamp(10, 0, 20)).toBe(10);
  });

  it("returns min when below range", () => {
    expect(clamp(-5, 0, 20)).toBe(0);
  });

  it("returns max when above range", () => {
    expect(clamp(50, 0, 20)).toBe(20);
  });
});
