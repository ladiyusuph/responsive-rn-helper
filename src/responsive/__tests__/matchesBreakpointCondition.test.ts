import { matchesBreakpointCondition } from "../utils";
import type { DeviceType } from "../types";

describe("matchesBreakpointCondition", () => {
  it("matches 'above' inclusively", () => {
    expect(matchesBreakpointCondition("tablet", { above: "tablet" })).toBe(true);
    expect(matchesBreakpointCondition("large-tablet", { above: "tablet" })).toBe(true);
    expect(matchesBreakpointCondition("phone", { above: "tablet" })).toBe(false);
  });

  it("matches 'below' inclusively", () => {
    expect(matchesBreakpointCondition("phone", { below: "phone" })).toBe(true);
    expect(matchesBreakpointCondition("small-phone", { below: "phone" })).toBe(true);
    expect(matchesBreakpointCondition("tablet", { below: "phone" })).toBe(false);
  });

  it("combines above and below as a range (AND)", () => {
    const range = { above: "phone" as const, below: "tablet" as const };
    expect(matchesBreakpointCondition("small-phone", range)).toBe(false);
    expect(matchesBreakpointCondition("phone", range)).toBe(true);
    expect(matchesBreakpointCondition("tablet", range)).toBe(true);
    expect(matchesBreakpointCondition("large-tablet", range)).toBe(false);
  });

  it("matches a single 'only' tier", () => {
    expect(matchesBreakpointCondition("tablet", { only: "tablet" })).toBe(true);
    expect(matchesBreakpointCondition("phone", { only: "tablet" })).toBe(false);
  });

  it("matches an array of 'only' tiers", () => {
    const condition = { only: ["small-phone", "phone"] as DeviceType[] };
    expect(matchesBreakpointCondition("small-phone", condition)).toBe(true);
    expect(matchesBreakpointCondition("phone", condition)).toBe(true);
    expect(matchesBreakpointCondition("tablet", condition)).toBe(false);
  });

  it("lets 'only' take precedence over above/below if both are given", () => {
    const condition = { only: "small-phone" as const, above: "tablet" as const };
    expect(matchesBreakpointCondition("small-phone", condition)).toBe(true);
    expect(matchesBreakpointCondition("large-tablet", condition)).toBe(false);
  });

  it("matches everything when no condition is given", () => {
    expect(matchesBreakpointCondition("small-phone", {})).toBe(true);
    expect(matchesBreakpointCondition("large-tablet", {})).toBe(true);
  });
});
