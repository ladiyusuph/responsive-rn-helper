import { resolveStyles } from "../styles";

describe("resolveStyles", () => {
  const styles = {
    card: {
      padding: 16,
      flexDirection: { compact: "column", medium: "row" },
      gap: { medium: 12 },
      shadowOffset: { width: 0, height: 2 },
      transform: [{ rotate: "45deg" }],
    },
  } as const;

  it("resolves per-tier values for the current tier", () => {
    expect(resolveStyles(styles, "compact").card.flexDirection).toBe("column");
    expect(resolveStyles(styles, "expanded").card.flexDirection).toBe("row");
  });

  it("drops properties with no value for the tier", () => {
    expect(resolveStyles(styles, "compact").card).not.toHaveProperty("gap");
    expect(resolveStyles(styles, "medium").card.gap).toBe(12);
  });

  it("leaves plain values and non-tier objects untouched", () => {
    const card = resolveStyles(styles, "large").card;
    expect(card.padding).toBe(16);
    expect(card.shadowOffset).toEqual({ width: 0, height: 2 });
    expect(card.transform).toEqual([{ rotate: "45deg" }]);
  });

  it("accepts 1.x tier keys", () => {
    expect(resolveStyles({ box: { width: { phone: 100, tablet: 200 } } }, "medium").box.width).toBe(200);
  });
});
