import React, { useEffect, useMemo } from "react";
import { View, type ViewProps } from "react-native";

import { useResponsive } from "../hooks/useResponsive";
import { useContainerWidth } from "../hooks/useContainerWidth";
import {
  computeGridLayout,
  computeGridPlaceholderCount,
  responsiveValue,
} from "../utils";
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
   * Auto-fit needs the width actually available to the grid. We start from
   * the window width and switch to the real container width once the grid
   * has been laid out (padded parent, drawer, modal, split view, etc.).
   *
   * Nothing else depends on the measurement: cell widths come from flexbox
   * (see below), and per-breakpoint `columns` / `itemHeight` maps follow the
   * screen breakpoint like every other responsive value. So with explicit
   * `columns` the very first frame is already correct.
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
  const { numColumns: columns } = useMemo(
    () =>
      computeGridLayout({
        // Explicit columns only need the breakpoint tier: use the screen
        // width so they never wait on (or jump after) measurement.
        width: columnsProp !== undefined ? screenWidth : width,
        columns: columnsProp,
        minItemWidth,
        gap,
        minColumns,
        maxColumns,
        breakpoints,
      }),
    [
      columnsProp,
      screenWidth,
      width,
      breakpoints,
      minItemWidth,
      gap,
      minColumns,
      maxColumns,
    ],
  );

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

    return responsiveValue(screenWidth, itemHeight, undefined, breakpoints);
  }, [screenWidth, itemHeight, breakpoints]);

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
   * Empty cells needed to complete a short last row.
   *
   * Example:
   *
   * 4 columns
   * 6 items
   *
   * Row 1: 0 1 2 3
   * Row 2: 4 5 _ _
   *
   * placeholderCount = 2 (0 when stretchLastRow, so 4 and 5 share the row)
   */
  const placeholderCount = computeGridPlaceholderCount(
    childCount,
    columns,
    stretchLastRow,
  );

  /**
   * These booleans make the cell geometry easier
   * to understand and prevent height/aspectRatio
   * conflicts.
   */
  const hasExplicitHeight = resolvedItemHeight !== undefined;

  const hasAspectRatio = !hasExplicitHeight && aspectRatio !== undefined;

  /**
   * Cell sizing is pure flexbox, so it needs no pixel math:
   *
   * Every cell starts from the same tiny basis and grows equally, so each
   * row splits its width exactly between its cells — no rounding, no
   * sub-pixel overflow wrapping the last cell. A full-width "row break"
   * after every `columns` cells guarantees exactly `columns` cells per row,
   * and placeholder cells keep a short last row's cells the same width as
   * everyone else's.
   */
  const cellStyle = useMemo(
    () => ({
      flexBasis: 1,

      flexGrow: 1,

      flexShrink: 0,

      /**
       * Stretch to the row's height, except with aspectRatio:
       * Yoga resolves a stretched + flex-grown cell's aspect
       * ratio to a height of 0, so let it size itself instead.
       */
      alignSelf: hasAspectRatio ? ("flex-start" as const) : ("stretch" as const),

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
    }),
    [hasAspectRatio, hasExplicitHeight, resolvedItemHeight, aspectRatio],
  );

  /**
   * The row break doubles as the vertical gap: the container's rowGap is 0,
   * and the break's height is the gap between two rows.
   */
  const rowBreakStyle = useMemo(
    () => ({ flexBasis: "100%" as const, height: gap }),
    [gap],
  );

  const cells: React.ReactNode[] = [];

  validChildren.forEach((child, index) => {
    if (index > 0 && index % columns === 0) {
      cells.push(<View key={`row-break-${index}`} style={rowBreakStyle} />);
    }

    cells.push(
      <View key={child.key ?? index} style={cellStyle}>
        {child}
      </View>,
    );
  });

  for (let i = 0; i < placeholderCount; i++) {
    cells.push(
      <View key={`placeholder-${i}`} style={cellStyle} pointerEvents="none" />,
    );
  }

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
           * Native gap handles spacing between cells; row breaks
           * handle spacing between rows.
           *
           * No negative margins.
           * No padding hacks.
           */
          columnGap: gap,
          rowGap: 0,
        },
        style,
      ]}
    >
      {cells}
    </View>
  );
}
