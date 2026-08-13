import React, { useCallback, useMemo, useState } from "react";
import { View, type LayoutChangeEvent, type ViewProps } from "react-native";
import { useResponsive } from "../hooks/useResponsive";
import { computeGridColumns } from "../utils";

type ResponsiveGridProps = ViewProps & {
  children: React.ReactNode;

  /**
   * Minimum width each grid item should have.
   * The grid uses this value to determine how many columns can fit.
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
   *
   * Useful for preventing very wide screens from creating
   * an excessive number of columns.
   */
  maxColumns?: number;

  /**
   * Minimum number of columns the grid should display.
   *
   * @default 1
   */
  minColumns?: number;
};

/**
 * A responsive grid that automatically determines the number of
 * columns based on the actual width available to the grid.
 *
 * Unlike a breakpoint-based grid, ResponsiveGrid does not require
 * you to specify how many columns should appear at each screen size.
 *
 * Instead, it uses `minItemWidth` as a layout constraint:
 *
 *     available width
 *            ↓
 *     minimum item width
 *            ↓
 *     calculate columns
 *
 * This makes the grid responsive even when it is nested inside
 * containers, cards, modals, split views, etc.
 */
export function ResponsiveGrid({
  children,
  minItemWidth = 160,
  gap = 12,
  maxColumns,
  minColumns = 1,
  style,
  onLayout,
  ...props
}: ResponsiveGridProps) {
  /*
   * Screen width is used only as a fallback for the initial render.
   *
   * The actual width of the grid may be smaller than the screen,
   * especially when the grid is inside a ResponsiveContainer,
   * card, modal, or another constrained parent.
   */
  const { width: screenWidth } = useResponsive();

  /*
   * Once React Native measures the grid, we store its actual width.
   *
   * `null` means the grid has not been measured yet.
   */
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);

  /*
   * Use the measured container width whenever available.
   * Until the first layout measurement, fall back to screen width
   * so the grid can still render immediately.
   */
  const width = measuredWidth ?? screenWidth;

  /*
   * Determine how many columns can fit based on the available width
   * and the minimum width requested for each item.
   *
   * `minColumns` and `maxColumns` allow consumers to place boundaries
   * around the automatically calculated column count.
   */
  const columns = useMemo(() => {
    const calculated = computeGridColumns(width, minItemWidth, gap);

    // Never allow the calculated column count below minColumns.
    const withMinimum = Math.max(calculated, minColumns);

    // If maxColumns is provided, prevent the grid from exceeding it.
    return maxColumns === undefined
      ? withMinimum
      : Math.min(withMinimum, maxColumns);
  }, [width, minItemWidth, gap, minColumns, maxColumns]);

  /*
   * Calculate the exact width of each grid item.
   *
   * Instead of assigning each item a percentage width, we subtract
   * the total space occupied by the gaps first:
   *
   *   available width - total gaps
   *   ----------------------------
   *             columns
   *
   * For example:
   *
   *   width = 390
   *   columns = 2
   *   gap = 16
   *
   *   (390 - 16) / 2 = 187px per item
   */
  const itemWidth = useMemo(() => {
    if (columns <= 0) {
      return 0;
    }

    return (width - gap * (columns - 1)) / columns;
  }, [width, gap, columns]);

  /*
   * Capture the actual width of the grid whenever its layout changes.
   *
   * This is important because the grid's width is not necessarily
   * equal to the device's screen width.
   */
  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const nextWidth = event.nativeEvent.layout.width;

      /*
       * Avoid updating state when the measured width has not changed.
       * This prevents unnecessary re-renders from repeated layout events.
       */
      setMeasuredWidth((previousWidth) =>
        previousWidth === nextWidth ? previousWidth : nextWidth,
      );

      /*
       * Preserve the consumer's onLayout callback so using
       * ResponsiveGrid does not prevent access to the native
       * layout event.
       */
      onLayout?.(event);
    },
    [onLayout],
  );

  return (
    <View
      {...props}
      onLayout={handleLayout}
      style={[
        {
          /*
           * Items flow horizontally and wrap onto the next line
           * whenever there is no longer enough space.
           */
          flexDirection: "row",
          flexWrap: "wrap",

          /*
           * Each item receives half of the gap on either side.
           * The negative margin keeps the outer edges aligned with
           * the grid container.
           */
          marginHorizontal: -gap / 2,
        },
        style,
      ]}
    >
      {React.Children.map(children, (child) => {
        /*
         * React.Children.map can encounter null/undefined children,
         * so don't create an empty grid cell for them.
         */
        if (child == null) {
          return null;
        }

        return (
          <View
            style={{
              /*
               * The wrapper includes the item width plus the gap.
               * Horizontal padding then creates half the gap on
               * each side of the child.
               */
              width: itemWidth + gap,
              paddingHorizontal: gap / 2,

              /*
               * Creates the vertical spacing between rows.
               */
              marginBottom: gap,
            }}
          >
            {child}
          </View>
        );
      })}
    </View>
  );
}
