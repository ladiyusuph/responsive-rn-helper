import React, { useCallback, useMemo, useState } from "react";
import { View, type LayoutChangeEvent, type ViewProps } from "react-native";
import { useResponsive } from "../hooks/useResponsive";
import { computeGridColumns } from "../utils";

type ResponsiveGridProps = ViewProps & {
  children: React.ReactNode;

  /**
   * Minimum width each grid item should have.
   * @default 160
   */
  minItemWidth?: number;

  /**
   * Horizontal and vertical spacing between grid items.
   * @default 12
   */
  gap?: number;

  /**
   * Maximum number of columns the grid is allowed to display.
   */
  maxColumns?: number;

  /**
   * Minimum number of columns the grid should display.
   * @default 1
   */
  minColumns?: number;

  /**
   * When true, items on an incomplete last row expand
   * to fill the available space.
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
  stretchLastRow = false,
  style,
  onLayout,
  ...props
}: ResponsiveGridProps) {
  const { width: screenWidth } = useResponsive();
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);

  const width = measuredWidth ?? screenWidth;

  const columns = useMemo(() => {
    const calculated = computeGridColumns(width, minItemWidth, gap);
    const withMinimum = Math.max(calculated, minColumns);

    return maxColumns === undefined
      ? withMinimum
      : Math.min(withMinimum, maxColumns);
  }, [width, minItemWidth, gap, minColumns, maxColumns]);

  /**
   * Width available for each grid cell after accounting for
   * the gaps between columns.
   */
  const cellWidth = useMemo(() => {
    if (columns <= 0) return 0;

    return Math.floor((width - gap * (columns - 1)) / columns);
  }, [width, gap, columns]);

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

  const validChildren = useMemo(
    () => React.Children.toArray(children).filter(React.isValidElement),
    [children],
  );

  const childCount = validChildren.length;

  const isIncompleteLastRow =
    columns > 0 && childCount > 0 && childCount % columns !== 0;

  const lastRowStart =
    columns > 0 ? Math.floor((childCount - 1) / columns) * columns : 0;

  return (
    <View
      {...props}
      onLayout={handleLayout}
      style={[
        {
          width: "100%",
          flexDirection: "row",
          flexWrap: "wrap",
          marginHorizontal: -gap / 2,
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
              flexBasis: cellWidth,
              flexGrow: shouldGrow ? 1 : 0,
              flexShrink: 0,
              paddingHorizontal: gap / 2,
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
