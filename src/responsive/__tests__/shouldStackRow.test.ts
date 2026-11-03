import { shouldStackRow } from "../utils";

describe("shouldStackRow", () => {
  const smallPhoneBreakpoint = 360;

  it("stacks when width is below the smallPhone breakpoint and stackOnSmall is true", () => {
    expect(shouldStackRow(320, smallPhoneBreakpoint, true)).toBe(true);
  });

  it("does not stack when width is at or above the smallPhone breakpoint", () => {
    expect(shouldStackRow(360, smallPhoneBreakpoint, true)).toBe(false);
    expect(shouldStackRow(600, smallPhoneBreakpoint, true)).toBe(false);
  });

  it("never stacks when stackOnSmall is false, regardless of width", () => {
    expect(shouldStackRow(200, smallPhoneBreakpoint, false)).toBe(false);
  });

  it("reflects a narrow measured container width, not just device width", () => {
    // This is the scenario ResponsiveRow's measureContainer default fixes:
    // a row squeezed into a narrow panel/sidebar on an otherwise wide device.
    const narrowSidebarWidth = 280;
    expect(shouldStackRow(narrowSidebarWidth, smallPhoneBreakpoint, true)).toBe(true);
  });

  it("uses a custom stackBelow width in place of the breakpoint", () => {
    expect(shouldStackRow(400, 480, true)).toBe(true);
    expect(shouldStackRow(480, 480, true)).toBe(false);
  });

  it("stacks at a large accessibility font scale even when wide", () => {
    expect(
      shouldStackRow(800, smallPhoneBreakpoint, true, { current: 1.5, stackAt: 1.3 }),
    ).toBe(true);
    expect(
      shouldStackRow(800, smallPhoneBreakpoint, true, { current: 1.0, stackAt: 1.3 }),
    ).toBe(false);
  });

  it("ignores font scale when stackAt isn't set", () => {
    expect(shouldStackRow(800, smallPhoneBreakpoint, true, { current: 3 })).toBe(false);
  });

  it("never stacks for font scale when stackOnSmall is false", () => {
    expect(
      shouldStackRow(800, smallPhoneBreakpoint, false, { current: 2, stackAt: 1.3 }),
    ).toBe(false);
  });
});
