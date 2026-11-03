import {
  getTier,
  isResponsiveMap,
  mergeBreakpoints,
  normalizeResponsiveValues,
  resolveBreakpoints,
  resolveResponsive,
} from "../tiers";
import { DEFAULT_BREAKPOINTS } from "../constants";
import { responsiveValue } from "../utils";

describe("getTier", () => {
  it("classifies widths into Material 3 window size classes", () => {
    expect(getTier(390, DEFAULT_BREAKPOINTS)).toBe("compact");
    expect(getTier(700, DEFAULT_BREAKPOINTS)).toBe("medium");
    expect(getTier(1000, DEFAULT_BREAKPOINTS)).toBe("expanded");
    expect(getTier(1366, DEFAULT_BREAKPOINTS)).toBe("large");
  });

  it("treats each breakpoint as the start of the larger tier", () => {
    expect(getTier(599, DEFAULT_BREAKPOINTS)).toBe("compact");
    expect(getTier(600, DEFAULT_BREAKPOINTS)).toBe("medium");
    expect(getTier(840, DEFAULT_BREAKPOINTS)).toBe("expanded");
    expect(getTier(1200, DEFAULT_BREAKPOINTS)).toBe("large");
  });
});

describe("resolveResponsive", () => {
  const values = { compact: 8, medium: 12, expanded: 16, large: 24 };

  it("picks the current tier's value", () => {
    expect(resolveResponsive(values, "compact")).toBe(8);
    expect(resolveResponsive(values, "medium")).toBe(12);
    expect(resolveResponsive(values, "expanded")).toBe(16);
    expect(resolveResponsive(values, "large")).toBe(24);
  });

  it("is mobile-first: falls back to the nearest smaller tier, never a larger one", () => {
    const partial = { compact: 8, expanded: 16 };
    expect(resolveResponsive(partial, "medium")).toBe(8);
    expect(resolveResponsive(partial, "large")).toBe(16);
    expect(resolveResponsive({ medium: 3 }, "compact", 1)).toBe(1);
  });

  it("returns plain values unchanged", () => {
    expect(resolveResponsive(42, "large")).toBe(42);
    expect(resolveResponsive("row", "compact")).toBe("row");
  });

  it("uses the fallback for an empty map", () => {
    expect(resolveResponsive({}, "medium", 42)).toBe(42);
    expect(resolveResponsive({}, "medium")).toBeUndefined();
  });

  it("accepts 1.x keys: small/phone → compact, tablet → medium, largeTablet → expanded", () => {
    const legacy = { small: 1, phone: 2, tablet: 3, largeTablet: 4 };
    expect(resolveResponsive(legacy, "compact")).toBe(2);
    expect(resolveResponsive(legacy, "medium")).toBe(3);
    expect(resolveResponsive(legacy, "expanded")).toBe(4);
    expect(resolveResponsive(legacy, "large")).toBe(4);
    expect(resolveResponsive({ small: 1, tablet: 3 }, "compact")).toBe(1);
  });

  it("lets tier keys win over 1.x keys", () => {
    expect(resolveResponsive({ phone: 2, compact: 5 }, "compact")).toBe(5);
  });
});

describe("isResponsiveMap", () => {
  it("recognizes tier maps, including 1.x keys", () => {
    expect(isResponsiveMap({ compact: 1 })).toBe(true);
    expect(isResponsiveMap({ phone: 1, tablet: 2 })).toBe(true);
  });

  it("rejects plain values, style objects, arrays and fluid tokens", () => {
    expect(isResponsiveMap(12)).toBe(false);
    expect(isResponsiveMap({ width: 0, height: 2 } as never)).toBe(false);
    expect(isResponsiveMap([{ rotate: "45deg" }] as never)).toBe(false);
    expect(isResponsiveMap({ kind: "fluid", min: 1, max: 2 } as never)).toBe(false);
  });
});

describe("normalizeResponsiveValues", () => {
  it("leaves tier-keyed maps alone", () => {
    expect(normalizeResponsiveValues({ compact: 1, large: 2 })).toEqual({
      compact: 1,
      large: 2,
    });
  });
});

describe("resolveBreakpoints", () => {
  it("fills in defaults", () => {
    expect(resolveBreakpoints()).toMatchObject({ medium: 600, expanded: 840, large: 1200 });
  });

  it("maps 1.x names: phone → medium, tablet → expanded", () => {
    expect(resolveBreakpoints({ phone: 700, tablet: 1000 })).toMatchObject({
      medium: 700,
      expanded: 1000,
      large: 1200,
    });
  });

  it("keeps the 1.x aliases readable on the result", () => {
    const resolved = resolveBreakpoints({ medium: 700 });
    expect(resolved.phone).toBe(700);
    expect(resolved.tablet).toBe(840);
    expect(resolved.smallPhone).toBe(320);
  });

  it("never lets a larger tier start before a smaller one", () => {
    expect(resolveBreakpoints({ expanded: 1300 })).toMatchObject({
      expanded: 1300,
      large: 1300,
    });
  });
});

describe("mergeBreakpoints", () => {
  it("applies a partial override to resolved breakpoints", () => {
    const merged = mergeBreakpoints(resolveBreakpoints(), { expanded: 900 });
    expect(merged).toMatchObject({ medium: 600, expanded: 900, large: 1200 });
  });

  it("returns the base object when there's no override", () => {
    const base = resolveBreakpoints();
    expect(mergeBreakpoints(base)).toBe(base);
  });
});

describe("responsiveValue (deprecated)", () => {
  it("still resolves 1.x values against 1.x breakpoints", () => {
    const values = { phone: 12, tablet: 16, largeTablet: 24 };
    const legacyBreakpoints = { smallPhone: 320, phone: 600, tablet: 840 };

    expect(responsiveValue(390, values, 0, legacyBreakpoints)).toBe(12);
    expect(responsiveValue(700, values, 0, legacyBreakpoints)).toBe(16);
    expect(responsiveValue(1024, values, 0, legacyBreakpoints)).toBe(24);
  });
});
