import { defineDeprecated, warnDeprecated, warnOnce } from "../legacy";

describe("deprecation helpers", () => {
  const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

  beforeAll(() => {
    (globalThis as { __DEV__?: boolean }).__DEV__ = true;
  });

  afterAll(() => {
    delete (globalThis as { __DEV__?: boolean }).__DEV__;
    warn.mockRestore();
  });

  it("warns once per key", () => {
    warnOnce("test-key", "first");
    warnOnce("test-key", "second");
    warnOnce("other-key", "third");

    expect(warn.mock.calls.map(([message]) => message)).toEqual([
      "[responsive-rn] first",
      "[responsive-rn] third",
    ]);
  });

  it("labels deprecations with the removal version", () => {
    warn.mockClear();
    warnDeprecated("old-api", "oldApi() is now newApi()");

    expect(warn).toHaveBeenCalledWith(
      "[responsive-rn] oldApi() is now newApi() (deprecated in 2.0, removed in 3.0)",
    );
  });

  it("adds deprecated fields as readable, non-enumerable getters", () => {
    warn.mockClear();
    const target = defineDeprecated<{ current: number }, { legacy: number }>(
      { current: 1 },
      { legacy: { get: () => 2, message: "legacy is now current" } },
    );

    expect(target.legacy).toBe(2);
    expect(target.legacy).toBe(2);
    expect(Object.keys(target)).toEqual(["current"]);
    expect({ ...target }).toEqual({ current: 1 });
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("stays silent outside development", () => {
    warn.mockClear();
    (globalThis as { __DEV__?: boolean }).__DEV__ = false;
    warnOnce("prod-key", "should not print");
    (globalThis as { __DEV__?: boolean }).__DEV__ = true;

    expect(warn).not.toHaveBeenCalled();
  });
});
