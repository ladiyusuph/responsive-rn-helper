import React from "react";
import { View, type ViewProps } from "react-native";
import { useLayout } from "../hooks/useLayout";

export function ResponsiveRow({
  children, stackOnSmall = true, gap, style, ...props
}: ViewProps & {
  children: React.ReactNode;
  stackOnSmall?: boolean;
  gap?: number;
}) {
  const layout = useLayout();

  return (
    <View
      {...props}
      style={[
        {
          flexDirection: stackOnSmall && layout.isSmallPhone ? "column" : "row",
          gap: gap ?? layout.gap,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}