import { isDeepEqual } from "../utils";

describe("isDeepEqual", () => {
  it("treats structurally equal config objects as equal", () => {
    expect(
      isDeepEqual(
        { breakpoints: { tablet: 900 }, spacing: { screen: { phone: 16 } } },
        { breakpoints: { tablet: 900 }, spacing: { screen: { phone: 16 } } },
      ),
    ).toBe(true);
  });

  it("detects changed nested values", () => {
    expect(
      isDeepEqual({ screen: { phone: 16 } }, { screen: { phone: 20 } }),
    ).toBe(false);
  });

  it("distinguishes an explicit undefined key from a missing key", () => {
    expect(isDeepEqual({ tablet: undefined }, {})).toBe(false);
  });

  it("does not treat arrays and objects as equal", () => {
    expect(isDeepEqual([1], { 0: 1 })).toBe(false);
  });
});
