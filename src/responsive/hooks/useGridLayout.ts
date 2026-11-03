import { useMemo } from "react";
import { useResponsive } from "./useResponsive";
import { computeGridLayout, type GridLayoutOptions } from "../utils";

export type UseGridLayoutOptions = Omit<GridLayoutOptions, "width" | "tier" | "breakpoints"> & {
  /**
   * Width available to the list. Defaults to the window width — pass the
   * value from useContainerWidth() when the list sits inside padding.
   */
  width?: number | null;
};

/**
 * Column count and item width for virtualized lists, using the same rules
 * as ResponsiveGrid. ResponsiveGrid renders every child; use this with
 * FlatList / FlashList for long lists.
 *
 * ```tsx
 * const { numColumns, itemWidth, gap } = useGridLayout({ minItemWidth: 160 });
 * <FlatList
 *   key={numColumns} // FlatList can't change numColumns on the fly
 *   numColumns={numColumns}
 *   columnWrapperStyle={numColumns > 1 ? { gap } : undefined}
 *   contentContainerStyle={{ gap }}
 *   renderItem={({ item }) => <Card style={{ width: itemWidth }} item={item} />}
 * />
 * ```
 */
export function useGridLayout({
  width: widthOption,
  columns,
  minItemWidth,
  gap,
  minColumns,
  maxColumns,
}: UseGridLayoutOptions = {}) {
  const { width: windowWidth, tier, breakpoints } = useResponsive();
  const width = widthOption ?? windowWidth;

  return useMemo(
    () =>
      computeGridLayout({
        width,
        columns,
        // Per-tier columns follow the screen tier, like ResponsiveGrid.
        tier,
        minItemWidth,
        gap,
        minColumns,
        maxColumns,
        breakpoints,
      }),
    [width, columns, tier, minItemWidth, gap, minColumns, maxColumns, breakpoints],
  );
}
