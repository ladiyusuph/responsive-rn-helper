import React, { useEffect, useMemo } from "react";
import { View, type ViewProps } from "react-native";

import { useResponsive } from "../hooks/useResponsive";
import { useContainerWidth } from "../hooks/useContainerWidth";
import { computeGridLayout, responsiveValue } from "../utils";
import type { ResponsiveValues } from "../types";

type ResponsiveGridProps = ViewProps & {
  children: React.ReactNode;

  /**
   * Explicit column count — bypasses auto-fit entirely.
   *
   * When provided, the grid no longer derives column count from
   * `minItemWidth`/`minColumns`/`maxColumns` (which are ignored, with a
   * dev warning if also supplied). You are stating the exact number of
   * columns; the grid divides the available width evenly between them.
   *
   * Can be a fixed number:
   *
   * columns={2}
   *
   * Or responsive, one count per breakpoint:
   *
   * columns={{
   *   small: 1,
   *   phone: 2,
   *   tablet: 3,
   *   largeTablet: 4,
   * }}
   *
   * Use this when you want a guaranteed, deterministic column count and
   * don't want cell width to influence how many columns are shown. Use
   * `minItemWidth` (below) instead when you want the grid to auto-fit as
   * many columns as comfortably fit an unknown/variable container width.
   */
  columns?: number | ResponsiveValues<number>;

  /**
   * Minimum width each grid item should have.
   *
   * Ignored when `columns` is provided.
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
   * Ignored when `columns` is provided.
   */
  maxColumns?: number;

  /**
   * Minimum number of columns the grid should display.
   *
   * Ignored when `columns` is provided.
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
  columns: columnsProp,
  minItemWidth,
  gap = 12,
  maxColumns,
  minColumns,
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

  const { width: measuredWidth, onLayout: handleLayout } =
    useContainerWidth(onLayout);

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
   * `columns` bypasses the auto-fit algorithm entirely. If the caller also
   * passed the auto-fit props, they're silently ignored below — warn so
   * that's not a silent surprise.
   */
  useEffect(() => {
    if (
      __DEV__ &&
      columnsProp !== undefined &&
      (minItemWidth !== undefined ||
        minColumns !== undefined ||
        maxColumns !== undefined)
    ) {
      console.warn(
        "ResponsiveGrid: 'columns' was provided, so 'minItemWidth', 'minColumns', " +
          "and 'maxColumns' are ignored. Remove them, or remove 'columns' to go " +
          "back to auto-fit sizing.",
      );
    }
  }, [columnsProp, minItemWidth, minColumns, maxColumns]);

  /**
   * maxColumns < minColumns is a contradictory configuration.
   * resolveGridColumns() lets minColumns win, but warn so it's not silent.
   * Only relevant in auto-fit mode — 'columns' overrides both anyway.
   */
  useEffect(() => {
    if (
      __DEV__ &&
      columnsProp === undefined &&
      maxColumns !== undefined &&
      minColumns !== undefined &&
      maxColumns < minColumns
    ) {
      console.warn(
        `ResponsiveGrid: 'maxColumns' (${maxColumns}) is less than 'minColumns' ` +
          `(${minColumns}). 'minColumns' will take precedence.`,
      );
    }
  }, [columnsProp, minColumns, maxColumns]);

  /**
   * Column count comes from one of two mutually exclusive strategies:
   *
   * 1. Explicit ('columns' prop): the caller states the exact column
   *    count (optionally per breakpoint). No auto-fit math runs at all —
   *    cell width is purely a function of the column count.
   *
   * 2. Auto-fit (default): the grid calculates how many columns of at
   *    least 'minItemWidth' can fit in the available width, then clamps
   *    that to ['minColumns', 'maxColumns'].
   */
  const { numColumns: columns, itemWidth: cellWidth } = useMemo(
    () =>
      computeGridLayout({
        width,
        columns: columnsProp,
        minItemWidth,
        gap,
        minColumns,
        maxColumns,
        breakpoints,
      }),
    [columnsProp, width, breakpoints, minItemWidth, gap, minColumns, maxColumns],
  );

  /**
   * Cell sizing, without sub-pixel wrapping:
   *
   * width = 393, columns = 2, gap = 12
   * cellWidth = (393 - 12) / 2 = 190.5
   *
   * Setting `width: 190.5` on every cell can overflow the line by a rounding
   * error and wrap the last cell. Instead each cell starts from a basis a
   * little BELOW the exact width (so exactly `columns` cells always fit on a
   * line), then flex-grows into the leftover space, capped at the exact
   * width by `maxWidth`. Full rows land flush with both edges; cells on a
   * short last row keep the same width as everyone else.
   */
  const cellBasis = Math.max(0, Math.floor(cellWidth) - 1);

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
              flexBasis: cellBasis,

              flexGrow: 1,

              /**
               * Cap at the exact cell width. Dropped for a short last row
               * when stretchLastRow is on, so those cells share the row.
               */
              maxWidth: shouldGrow ? undefined : cellWidth,

              /**
               * Prevent cells from shrinking below
               * their calculated geometry.
               */
              flexShrink: 0,

              /**
               * Stretch to the row's height, except with aspectRatio:
               * Yoga resolves a stretched + flex-grown cell's aspect
               * ratio to a height of 0, so let it size itself instead.
               */
              alignSelf: hasAspectRatio ? "flex-start" : "stretch",

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
