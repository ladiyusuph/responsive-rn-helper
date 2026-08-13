import { computeBreakpointFlags } from "../utils";
import { DEFAULT_BREAKPOINTS } from "../constants";

describe("computeBreakpointFlags", () => {
  const bp = DEFAULT_BREAKPOINTS; // { smallPhone: 360, phone: 600, tablet: 840 }

  it("classifies a small phone", () => {
    const flags = computeBreakpointFlags(320, 700, bp);
    expect(flags.deviceType).toBe("small-phone");
    expect(flags.isSmallPhone).toBe(true);
    expect(flags.isPhone).toBe(true);
    expect(flags.isTablet).toBe(false);
    expect(flags.isLargeTablet).toBe(false);
  });

  it("classifies a regular phone", () => {
    const flags = computeBreakpointFlags(390, 844, bp);
    expect(flags.deviceType).toBe("phone");
    expect(flags.isSmallPhone).toBe(false);
    expect(flags.isPhone).toBe(true);
    expect(flags.isTablet).toBe(false);
  });

  it("classifies a tablet", () => {
    const flags = computeBreakpointFlags(700, 1000, bp);
    expect(flags.deviceType).toBe("tablet");
    expect(flags.isPhone).toBe(false);
    expect(flags.isTablet).toBe(true);
    expect(flags.isLargeTablet).toBe(false);
  });

  it("classifies a large tablet, and isTablet stays true for it too", () => {
    const flags = computeBreakpointFlags(1024, 1366, bp);
    expect(flags.deviceType).toBe("large-tablet");
    expect(flags.isTablet).toBe(true);
    expect(flags.isLargeTablet).toBe(true);
  });

  it("treats each breakpoint boundary as inclusive of the larger tier", () => {
    expect(computeBreakpointFlags(bp.smallPhone, 800, bp).deviceType).toBe("phone");
    expect(computeBreakpointFlags(bp.phone, 800, bp).deviceType).toBe("tablet");
    expect(computeBreakpointFlags(bp.tablet, 800, bp).deviceType).toBe("large-tablet");
  });

  it("derives isLandscape from width vs height, independent of breakpoints", () => {
    expect(computeBreakpointFlags(800, 400, bp).isLandscape).toBe(true);
    expect(computeBreakpointFlags(400, 800, bp).isLandscape).toBe(false);
  });

  it("respects custom breakpoint overrides", () => {
    const custom = { smallPhone: 400, phone: 700, tablet: 1000 };
    expect(computeBreakpointFlags(650, 800, custom).deviceType).toBe("phone");
    expect(computeBreakpointFlags(650, 800, bp).deviceType).toBe("tablet");
  });
});
