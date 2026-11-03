import React from "react";
import { View, type ViewProps } from "react-native";

import { useLayout } from "../hooks/useLayout";
import { useContainerWidth } from "../hooks/useContainerWidth";
import { shouldStackRow } from "../utils";

type ResponsiveRowProps = ViewProps & {
  children: React.ReactNode;

  /**
   * When true (default), stack children into a column once the row's
   * available width drops below `stackBelow`.
   *
   * @default true
   */
  stackOnSmall?: boolean;

  /**
   * Width (in px) below which the row stacks. Measured against the row's
   * own width when `measureContainer` is on.
   *
   * stackBelow={480}  // two buttons that need ~240px each
   *
   * @default 320
   */
  stackBelow?: number;

  /**
   * Also stack when the user's accessibility font size is at least this
   * multiplier, whatever the width — large text rarely fits side by side.
   *
   * stackAtFontScale={1.3}
   *
   * Off by default.
   */
  stackAtFontScale?: number;

  /**
   * Horizontal (or, once stacked, vertical) gap between children.
   *
   * Defaults to the `spacing.gap` token.
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
   * device itself is nowhere near a phone's width.
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
  stackBelow,
  stackAtFontScale,
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
    // breakpoints.smallPhone is 320 unless a 1.x config overrides it.
    stackBelow ?? layout.breakpoints.smallPhone,
    stackOnSmall,
    { current: layout.fontScale, stackAt: stackAtFontScale },
  );

  return (
    <View
      {...props}
      onLayout={measureContainer ? handleLayout : onLayout}
      style={[
        {
          flexDirection: isStacked ? "column" : "row",
          gap: gap ?? layout.spacing.gap,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
