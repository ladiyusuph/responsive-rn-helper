import { FlatList, Text, View } from "react-native";
import { createStyles, useContainerWidth, useGridLayout } from "@ladiyusuph/responsive-rn";

import { colors } from "../theme";

const ITEMS = Array.from({ length: 120 }, (_, index) => ({ id: String(index), title: `Product ${index + 1}` }));

const useStyles = createStyles((t) => ({
  screen: { flex: 1, paddingHorizontal: t.spacing.screen },
  header: { paddingVertical: t.spacing.lg, gap: t.spacing.xs },
  title: { ...t.text.heading, color: colors.text },
  meta: { ...t.text.caption, color: colors.muted },
  list: { paddingBottom: t.spacing.section },
  card: {
    aspectRatio: 0.8,
    justifyContent: "flex-end",
    padding: t.spacing.md,
    borderRadius: t.radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { ...t.text.label, color: colors.text },
}));

export function ListScreen() {
  const styles = useStyles();
  const { width, onLayout } = useContainerWidth();
  const { numColumns, itemWidth, gap } = useGridLayout({ width, minItemWidth: 150, maxColumns: 6, gap: 12 });

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Long list</Text>
        <Text style={styles.meta}>
          useGridLayout + FlatList · {ITEMS.length} items · {numColumns} columns · {Math.round(itemWidth)}pt each
        </Text>
      </View>

      <View style={{ flex: 1 }} onLayout={onLayout}>
        <FlatList
          // FlatList can't change numColumns on the fly.
          key={numColumns}
          data={ITEMS}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={numColumns > 1 ? { gap } : undefined}
          contentContainerStyle={[styles.list, { gap }]}
          renderItem={({ item }) => (
            <View style={[styles.card, { width: itemWidth }]}>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}
