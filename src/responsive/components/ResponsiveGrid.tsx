import React, { useCallback, useState } from "react";
import { View, type LayoutChangeEvent, type ViewProps } from "react-native";
import { useResponsive } from "../hooks/useResponsive";
import { computeGridColumns } from "../utils";

export function ResponsiveGrid({
  children, minItemWidth = 160, gap = 12, style, onLayout, ...props
}: ViewProps & {
  children: React.ReactNode;
  minItemWidth?: number;
  gap?: number;
}) {
  // Screen width is only a fallback for the first paint, before we've
  // measured the space actually available to this grid. Relying on screen
  // width alone breaks as soon as the grid is nested inside anything
  // narrower than the full screen (a ResponsiveContainer, a card, a modal,
  // a split view, ...).
  const { width: screenWidth } = useResponsive();
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);
  const width = measuredWidth ?? screenWidth;

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setMeasuredWidth(event.nativeEvent.layout.width);
      onLayout?.(event);
    },
    [onLayout],
  );

  const columns = computeGridColumns(width, minItemWidth, gap);

  return (
    <View
      {...props}
      onLayout={handleLayout}
      style={[{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -gap / 2 }, style]}
    >
      {React.Children.map(children, (child) => (
        <View
          style={{
            width: `${100 / columns}%`,
            paddingHorizontal: gap / 2,
            marginBottom: gap,
          }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}
