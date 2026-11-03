import React from "react";
import { View, type ViewProps } from "react-native";

import { useLayout } from "../hooks/useLayout";
import { useContainerWidth } from "../hooks/useContainerWidth";
import { shouldStackRow } from "../utils";

type ResponsiveRowProps = ViewProps & {
  children: React.ReactNode;

  /**
   * When true (default), stack children into a column once the row's
   * available width drops below the `smallPhone` breakpoint.
   *
   * @default true
   */
  stackOnSmall?: boolean;

  /**
   * Horizontal (or, once stacked, vertical) gap between children.
   *
   * Defaults to the current responsive `gap` token.
   */
  gap?: number;

  /**
   * When true (default), the row measures its own rendered width via
   * onLayout and bases the stacking decision on the space actually
   * available to it — the same strategy ResponsiveGrid uses.
   *
   * This makes ResponsiveRow correct inside sidebars, split views, modals,
   * drawers, or any container narrower than the full screen: a row wedged
   * into a 300px panel on a wide tablet will now stack, even though the
   * device itself is nowhere near "small phone" width.
   *
   * Set to `false` to restore the legacy behavior of reacting only to
   * device/screen width, which is cheaper (no extra onLayout measurement)
   * and keeps every ResponsiveRow on a screen stacking in lockstep with
   * each other, at the cost of being wrong inside narrower containers.
   *
   * @default true
   */
  measureContainer?: boolean;
};

export function ResponsiveRow({
  children,
  stackOnSmall = true,
  gap,
  measureContainer = true,
  style,
  onLayout,
  ...props
}: ResponsiveRowProps) {
  /**
   * `layout.width` is the device/screen width — used as the initial
   * value before the row has actually been measured, and as the
   * permanent value when measureContainer is false.
   */
  const layout = useLayout();

  const { width: measuredWidth, onLayout: handleLayout } =
    useContainerWidth(onLayout);

  const width = measureContainer
    ? (measuredWidth ?? layout.width)
    : layout.width;

  const isStacked = shouldStackRow(
    width,
    layout.breakpoints.smallPhone,
    stackOnSmall,
  );

  return (
    <View
      {...props}
      onLayout={measureContainer ? handleLayout : onLayout}
      style={[
        {
          flexDirection: isStacked ? "column" : "row",
          gap: gap ?? layout.gap,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
