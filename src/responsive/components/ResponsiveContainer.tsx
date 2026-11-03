import React from "react";
import { View, type ViewProps } from "react-native";
import { useLayout } from "../hooks/useLayout";

/**
 * Centers content with the responsive `spacing.screen` padding, capped at
 * `layout.containerMaxWidth` on wide screens.
 */
export function ResponsiveContainer({
  children, style, ...props
}: ViewProps & { children: React.ReactNode }) {
  const { spacing, containerMaxWidth } = useLayout();

  return (
    <View
      {...props}
      style={[
        {
          width: "100%",
          maxWidth: containerMaxWidth,
          alignSelf: "center",
          paddingHorizontal: spacing.screen,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
