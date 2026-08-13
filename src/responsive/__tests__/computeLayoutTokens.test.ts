import { computeBreakpointFlags, computeLayoutTokens } from "../utils";
import { DEFAULT_BREAKPOINTS } from "../constants";

function layoutForWidth(width: number, height = 900) {
  const flags = computeBreakpointFlags(width, height, DEFAULT_BREAKPOINTS);
  return computeLayoutTokens(flags, width);
}

describe("computeLayoutTokens", () => {
  it("gives every tier a distinct horizontalPadding, largest for large tablets", () => {
    const smallPhone = layoutForWidth(320);
    const phone = layoutForWidth(390);
    const tablet = layoutForWidth(700);
    const largeTablet = layoutForWidth(1024);

    expect(smallPhone.horizontalPadding).toBe(12);
    expect(phone.horizontalPadding).toBe(16);
    expect(tablet.horizontalPadding).toBe(24);

    // Regression test: horizontalPadding used to check isTablet before
    // isLargeTablet, and since isTablet stays true for large tablets too,
    // the large-tablet value (32) was unreachable dead code and large
    // tablets silently fell back to the tablet-tier value (24).
    expect(largeTablet.horizontalPadding).toBe(32);
    expect(largeTablet.horizontalPadding).not.toBe(tablet.horizontalPadding);
  });

  it("caps contentMaxWidth appropriately by tier", () => {
    expect(layoutForWidth(320).contentMaxWidth).toBeUndefined();
    expect(layoutForWidth(390).contentMaxWidth).toBeUndefined();
    expect(layoutForWidth(700).contentMaxWidth).toBe(800);
    expect(layoutForWidth(1024).contentMaxWidth).toBe(1000);
  });

  it("keeps buttonHeight clamped between 48 and 56 regardless of width", () => {
    expect(layoutForWidth(200).buttonHeight).toBe(48);
    expect(layoutForWidth(2000).buttonHeight).toBe(56);
    const mid = layoutForWidth(390).buttonHeight;
    expect(mid).toBeGreaterThanOrEqual(48);
    expect(mid).toBeLessThanOrEqual(56);
  });

  it("gives large tablets more action/stat columns than plain tablets", () => {
    const tablet = layoutForWidth(700);
    const largeTablet = layoutForWidth(1024);
    expect(largeTablet.actionColumns).toBeGreaterThan(tablet.actionColumns);
    expect(largeTablet.statColumns).toBeGreaterThan(tablet.statColumns);
  });
});
