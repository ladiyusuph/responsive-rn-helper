import React from "react";
import { View, type ViewProps } from "react-native";
import { useLayout } from "../hooks/useLayout";

export function ResponsiveContainer({
  children, style, ...props
}: ViewProps & { children: React.ReactNode }) {
  const { horizontalPadding, contentMaxWidth } = useLayout();

  return (
    <View
      {...props}
      style={[
        {
          width: "100%",
          maxWidth: contentMaxWidth,
          alignSelf: "center",
          paddingHorizontal: horizontalPadding,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}