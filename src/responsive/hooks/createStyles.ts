import { useMemo } from "react";
import { useLayout, type Layout } from "./useLayout";
import {
  resolveStyles,
  type NamedResponsiveStyles,
  type ResolvedStyles,
} from "../styles";

/**
 * Like StyleSheet.create, but the factory receives every design token and
 * any property can take one value per tier.
 *
 * ```tsx
 * const useStyles = createStyles((t) => ({
 *   card: {
 *     padding: t.spacing.card,
 *     borderRadius: t.radii.lg,
 *     flexDirection: { compact: "column", medium: "row" },
 *   },
 *   title: t.text.title,
 * }));
 *
 * function Card() {
 *   const styles = useStyles();
 *   return <View style={styles.card}>...</View>;
 * }
 * ```
 */
export function createStyles<T extends NamedResponsiveStyles<T>>(
  factory: (tokens: Layout) => T,
): () => ResolvedStyles<T> {
  return function useStyles() {
    const layout = useLayout();

    return useMemo(
      () => resolveStyles(factory(layout) as Record<string, object>, layout.tier) as ResolvedStyles<T>,
      [layout],
    );
  };
}
