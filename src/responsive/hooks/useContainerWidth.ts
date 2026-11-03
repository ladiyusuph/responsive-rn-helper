import { useCallback, useState } from "react";
import type { LayoutChangeEvent } from "react-native";

/**
 * Measures the width a view actually gets from its parent — the building
 * block for container-aware layout (what ResponsiveGrid and ResponsiveRow
 * use internally). `width` is null until the first layout pass.
 *
 * ```tsx
 * const { width, onLayout } = useContainerWidth();
 * return <View onLayout={onLayout}>{width !== null && width < 400 ? <Compact /> : <Wide />}</View>;
 * ```
 */
export function useContainerWidth(
  onLayoutProp?: (event: LayoutChangeEvent) => void,
) {
  const [width, setWidth] = useState<number | null>(null);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const nextWidth = event.nativeEvent.layout.width;

      setWidth((previousWidth) =>
        previousWidth === nextWidth ? previousWidth : nextWidth,
      );

      onLayoutProp?.(event);
    },
    [onLayoutProp],
  );

  return { width, onLayout };
}
