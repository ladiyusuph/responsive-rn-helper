import { matchesBreakpointCondition } from "../utils";
import { DEFAULT_BREAKPOINTS } from "../constants";

// compact < 600 ≤ medium < 840 ≤ expanded < 1200 ≤ large
const bp = DEFAULT_BREAKPOINTS;
const COMPACT = 390;
const MEDIUM = 700;
const EXPANDED = 1000;
const LARGE = 1366;

describe("matchesBreakpointCondition", () => {
  it("matches 'above' inclusively", () => {
    expect(matchesBreakpointCondition(MEDIUM, { above: "medium" }, bp)).toBe(true);
    expect(matchesBreakpointCondition(LARGE, { above: "medium" }, bp)).toBe(true);
    expect(matchesBreakpointCondition(COMPACT, { above: "medium" }, bp)).toBe(false);
  });

  it("matches 'below' inclusively", () => {
    expect(matchesBreakpointCondition(MEDIUM, { below: "medium" }, bp)).toBe(true);
    expect(matchesBreakpointCondition(EXPANDED, { below: "medium" }, bp)).toBe(false);
  });

  it("combines above and below as a range (AND)", () => {
    const range = { above: "medium", below: "expanded" } as const;
    expect(matchesBreakpointCondition(COMPACT, range, bp)).toBe(false);
    expect(matchesBreakpointCondition(MEDIUM, range, bp)).toBe(true);
    expect(matchesBreakpointCondition(EXPANDED, range, bp)).toBe(true);
    expect(matchesBreakpointCondition(LARGE, range, bp)).toBe(false);
  });

  it("matches 'only' with one tier or several", () => {
    expect(matchesBreakpointCondition(EXPANDED, { only: "expanded" }, bp)).toBe(true);
    expect(matchesBreakpointCondition(LARGE, { only: "expanded" }, bp)).toBe(false);
    expect(
      matchesBreakpointCondition(LARGE, { only: ["expanded", "large"] }, bp),
    ).toBe(true);
  });

  it("uses the default breakpoints when none are passed", () => {
    expect(matchesBreakpointCondition(MEDIUM, { only: "medium" })).toBe(true);
  });

  it("respects custom breakpoints", () => {
    expect(
      matchesBreakpointCondition(700, { only: "compact" }, { medium: 768 }),
    ).toBe(true);
  });

  it("evaluates a 1.x device name exactly as 1.x did", () => {
    // 1.x "large-tablet" covered everything from 840 up: expanded AND large.
    expect(matchesBreakpointCondition(LARGE, { only: "large-tablet" }, bp)).toBe(true);
    expect(matchesBreakpointCondition(EXPANDED, { only: "large-tablet" }, bp)).toBe(true);
    // 1.x "phone" was 320–599.
    expect(matchesBreakpointCondition(COMPACT, { below: "phone" }, bp)).toBe(true);
    expect(matchesBreakpointCondition(MEDIUM, { below: "phone" }, bp)).toBe(false);
  });

  it("allows mixing tier names and 1.x names", () => {
    const condition = { above: "tablet", below: "expanded" } as const;
    expect(matchesBreakpointCondition(MEDIUM, condition, bp)).toBe(true);
    expect(matchesBreakpointCondition(LARGE, condition, bp)).toBe(false);
  });
});
