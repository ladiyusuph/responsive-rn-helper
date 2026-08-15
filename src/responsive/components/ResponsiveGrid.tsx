import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, type LayoutChangeEvent, type ViewProps } from "react-native";

import { useResponsive } from "../hooks/useResponsive";
import { computeGridColumns, responsiveValue } from "../utils";
import type { ResponsiveValues } from "../types";

type ResponsiveGridProps = ViewProps & {
  children: React.ReactNode;

  /**
   * Minimum width each grid item should have.
   *
   * @default 160
   */
  minItemWidth?: number;

  /**
   * Horizontal and vertical spacing between grid items.
   *
   * @default 12
   */
  gap?: number;

  /**
   * Maximum number of columns the grid is allowed to display.
   */
  maxColumns?: number;

  /**
   * Minimum number of columns the grid should display.
   *
   * @default 1
   */
  minColumns?: number;

  /**
   * Explicit height for every grid item.
   *
   * Can be a fixed number:
   *
   * itemHeight={120}
   *
   * Or responsive:
   *
   * itemHeight={{
   *   small: 100,
   *   phone: 120,
   *   tablet: 150,
   *   largeTablet: 170,
   * }}
   *
   * Cannot be used together with `aspectRatio`.
   */
  itemHeight?: number | ResponsiveValues<number>;

  /**
   * Aspect ratio for every grid item.
   *
   * For example:
   *
   * aspectRatio={1}
   *
   * creates square items.
   *
   * Cannot be used together with `itemHeight`.
   */
  aspectRatio?: number;

  /**
   * When true, items on an incomplete last row
   * expand to fill the available horizontal space.
   *
   * @default false
   */
  stretchLastRow?: boolean;
};

export function ResponsiveGrid({
  children,
  minItemWidth = 160,
  gap = 12,
  maxColumns,
  minColumns = 1,
  itemHeight,
  aspectRatio,
  stretchLastRow = false,
  style,
  onLayout,
  ...props
}: ResponsiveGridProps) {
  /**
   * We initially use the device/window width.
   *
   * Once the grid has actually been laid out, we replace
   * this with the real container width.
   *
   * This is important when ResponsiveGrid is inside a
   * padded parent, drawer, modal, split view, etc.
   */
  const { width: screenWidth, breakpoints } = useResponsive();

  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);

  const width = measuredWidth ?? screenWidth;

  /**
   * itemHeight and aspectRatio represent two different
   * geometry strategies.
   *
   * Warn developers if they accidentally provide both.
   */
  useEffect(() => {
    if (__DEV__ && itemHeight !== undefined && aspectRatio !== undefined) {
      console.warn(
        "ResponsiveGrid: 'itemHeight' and 'aspectRatio' " +
          "cannot be used together. 'itemHeight' will take precedence.",
      );
    }
  }, [itemHeight, aspectRatio]);

  /**
   * Calculate the number of columns that can fit inside
   * the actual available width.
   */
  const columns = useMemo(() => {
    const calculated = computeGridColumns(width, minItemWidth, gap);

    const withMinimum = Math.max(calculated, minColumns);

    return maxColumns === undefined
      ? withMinimum
      : Math.min(withMinimum, maxColumns);
  }, [width, minItemWidth, gap, minColumns, maxColumns]);

  /**
   * Calculate the exact width of one grid cell.
   *
   * Example:
   *
   * width = 393
   * columns = 2
   * gap = 12
   *
   * (393 - 12) / 2
   * = 190.5
   *
   * We intentionally do NOT Math.floor() this value.
   */
  const cellWidth = useMemo(() => {
    if (columns <= 0) {
      return 0;
    }

    return (width - gap * (columns - 1)) / columns;
  }, [width, gap, columns]);

  /**
   * Resolve the actual height when itemHeight is supplied.
   *
   * Supports:
   *
   * itemHeight={120}
   *
   * and:
   *
   * itemHeight={{
   *   small: 100,
   *   phone: 120,
   *   tablet: 150,
   * }}
   *
   * responsiveValue() handles partial responsive
   * configurations by cascading to the nearest
   * available value.
   */
  const resolvedItemHeight = useMemo(() => {
    if (itemHeight === undefined) {
      return undefined;
    }

    if (typeof itemHeight === "number") {
      return itemHeight;
    }

    return responsiveValue(width, itemHeight, undefined, breakpoints);
  }, [width, itemHeight, breakpoints]);

  /**
   * Tell the grid about its actual rendered width.
   */
  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const nextWidth = event.nativeEvent.layout.width;

      setMeasuredWidth((previousWidth) =>
        previousWidth === nextWidth ? previousWidth : nextWidth,
      );

      onLayout?.(event);
    },
    [onLayout],
  );

  /**
   * Remove null/false/non-element children so that
   * column calculations are based only on actual items.
   */
  const validChildren = useMemo(
    () => React.Children.toArray(children).filter(React.isValidElement),
    [children],
  );

  const childCount = validChildren.length;

  /**
   * Determine whether the final row has fewer items
   * than the calculated number of columns.
   */
  const isIncompleteLastRow =
    columns > 0 && childCount > 0 && childCount % columns !== 0;

  /**
   * Find the index at which the final row starts.
   *
   * Example:
   *
   * 4 columns
   * 6 items
   *
   * Row 1: 0 1 2 3
   * Row 2: 4 5
   *
   * lastRowStart = 4
   */
  const lastRowStart =
    columns > 0 ? Math.floor((childCount - 1) / columns) * columns : 0;

  /**
   * These booleans make the cell geometry easier
   * to understand and prevent height/aspectRatio
   * conflicts.
   */
  const hasExplicitHeight = resolvedItemHeight !== undefined;

  const hasAspectRatio = !hasExplicitHeight && aspectRatio !== undefined;

  return (
    <View
      {...props}
      onLayout={handleLayout}
      style={[
        {
          width: "100%",
          flexDirection: "row",
          flexWrap: "wrap",

          /**
           * Native gap handles spacing between cells.
           *
           * No negative margins.
           * No padding hacks.
           */
          columnGap: gap,
          rowGap: gap,
        },
        style,
      ]}
    >
      {validChildren.map((child, index) => {
        const isLastRow = index >= lastRowStart;

        const shouldGrow = stretchLastRow && isIncompleteLastRow && isLastRow;

        return (
          <View
            key={child.key ?? index}
            style={{
              /**
               * Normal cells have an exact calculated width.
               *
               * Last-row cells can grow when
               * stretchLastRow is enabled.
               */
              width: shouldGrow ? undefined : cellWidth,

              flexGrow: shouldGrow ? 1 : 0,

              /**
               * Prevent cells from shrinking below
               * their calculated geometry.
               */
              flexShrink: 0,

              /**
               * Explicit height takes priority.
               */
              ...(hasExplicitHeight && {
                height: resolvedItemHeight,
              }),

              /**
               * Aspect ratio is used only when
               * explicit height isn't supplied.
               */
              ...(hasAspectRatio && {
                aspectRatio,
              }),
            }}
          >
            {child}
          </View>
        );
      })}
    </View>
  );
}
