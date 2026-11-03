import { Text, View } from "react-native";
import { createStyles } from "@ladiyusuph/responsive-rn";
import { colors } from "../theme";

const useStyles = createStyles((t) => ({
  tile: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.primarySoft,
    borderRadius: t.radii.lg,
    padding: t.spacing.md,
  },
  label: { ...t.text.label, color: colors.primary },
}));

/** A grid cell placeholder: fills whatever geometry the grid gives it. */
export function Tile({ label }: { label: string }) {
  const styles = useStyles();

  return (
    <View style={styles.tile}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
