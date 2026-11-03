import { Pressable, Text, View } from "react-native";
import { createStyles } from "@ladiyusuph/responsive-rn";
import { colors } from "../theme";

export type ScreenKey = "showcase" | "list" | "legacy";

export const SCREENS: Array<{ key: ScreenKey; title: string }> = [
  { key: "showcase", title: "Showcase" },
  { key: "list", title: "Long list" },
  { key: "legacy", title: "1.x compat" },
];

type NavigationProps = {
  current: ScreenKey;
  onSelect: (screen: ScreenKey) => void;
};

const useStyles = createStyles((t) => ({
  tabBar: {
    flexDirection: "row",
    height: t.sizes.tabBarHeight,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: { flex: 1, alignItems: "center", justifyContent: "center" },
  sideNav: {
    width: t.sizes.sideNavWidth,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    padding: t.spacing.lg,
    gap: t.spacing.xs,
  },
  brand: { ...t.text.title, color: colors.text, marginBottom: t.spacing.lg },
  sideItem: {
    paddingVertical: t.spacing.sm,
    paddingHorizontal: t.spacing.md,
    borderRadius: t.radii.md,
  },
  sideItemActive: { backgroundColor: colors.primarySoft },
  label: { ...t.text.button, color: colors.muted },
  labelActive: { color: colors.primary },
}));

/** Bottom tabs, used below the expanded tier. */
export function TabBar({ current, onSelect }: NavigationProps) {
  const styles = useStyles();

  return (
    <View style={styles.tabBar}>
      {SCREENS.map(({ key, title }) => (
        <Pressable key={key} style={styles.tab} onPress={() => onSelect(key)}>
          <Text style={[styles.label, key === current && styles.labelActive]}>{title}</Text>
        </Pressable>
      ))}
    </View>
  );
}

/** A navigation rail, used from the expanded tier up. */
export function SideNav({ current, onSelect }: NavigationProps) {
  const styles = useStyles();

  return (
    <View style={styles.sideNav}>
      <Text style={styles.brand}>Responsive RN</Text>
      {SCREENS.map(({ key, title }) => (
        <Pressable
          key={key}
          style={[styles.sideItem, key === current && styles.sideItemActive]}
          onPress={() => onSelect(key)}
        >
          <Text style={[styles.label, key === current && styles.labelActive]}>{title}</Text>
        </Pressable>
      ))}
    </View>
  );
}
