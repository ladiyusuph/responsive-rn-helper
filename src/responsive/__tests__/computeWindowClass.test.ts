import { computeBreakpointFlags, computeWindowClass } from "../utils";
import { resolveBreakpoints } from "../tiers";

const bp = resolveBreakpoints();

describe("computeWindowClass", () => {
  it("classifies the tier from width", () => {
    expect(computeWindowClass(390, 844, bp).tier).toBe("compact");
    expect(computeWindowClass(820, 1180, bp).tier).toBe("medium");
    expect(computeWindowClass(1180, 820, bp).tier).toBe("expanded");
  });

  it("derives isLandscape from width vs height", () => {
    expect(computeWindowClass(800, 400, bp).isLandscape).toBe(true);
    expect(computeWindowClass(400, 800, bp).isLandscape).toBe(false);
  });

  it("classifies a landscape phone by form factor, not by width alone", () => {
    // iPhone 15 Pro Max in landscape: wider than the expanded breakpoint.
    const flags = computeWindowClass(932, 430, bp);
    expect(flags.tier).toBe("expanded");
    expect(flags.shortestSide).toBe(430);
    expect(flags.formFactor).toBe("phone");
  });

  it("classifies a tablet form factor in either orientation", () => {
    expect(computeWindowClass(820, 1180, bp).formFactor).toBe("tablet");
    expect(computeWindowClass(1180, 820, bp).formFactor).toBe("tablet");
  });
});

describe("computeBreakpointFlags (deprecated)", () => {
  const legacy = { smallPhone: 320, phone: 600, tablet: 840 };

  it("keeps the 1.x flags and device types", () => {
    expect(computeBreakpointFlags(319, 700, legacy)).toMatchObject({
      deviceType: "small-phone",
      isSmallPhone: true,
      isPhone: true,
      isTablet: false,
    });
    expect(computeBreakpointFlags(390, 844, legacy)).toMatchObject({
      deviceType: "phone",
      isSmallPhone: false,
      isPhone: true,
    });
    expect(computeBreakpointFlags(700, 1000, legacy)).toMatchObject({
      deviceType: "tablet",
      isTablet: true,
      isLargeTablet: false,
    });
  });

  it("calls everything from 840 up large-tablet, as 1.x did", () => {
    expect(computeBreakpointFlags(1366, 1024, legacy)).toMatchObject({
      deviceType: "large-tablet",
      isTablet: true,
      isLargeTablet: true,
      tier: "large",
    });
  });
});
