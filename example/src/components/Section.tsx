import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { createStyles } from "@ladiyusuph/responsive-rn";
import { colors } from "../theme";

const useStyles = createStyles((t) => ({
  section: {
    backgroundColor: colors.surface,
    borderRadius: t.radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: t.spacing.card,
    gap: t.spacing.md,
  },
  overline: { ...t.text.overline, color: colors.primary },
  title: { ...t.text.title, color: colors.text },
  description: { ...t.text.body, color: colors.muted },
}));

export function Section({
  label,
  title,
  description,
  children,
}: {
  label: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const styles = useStyles();

  return (
    <View style={styles.section}>
      <View>
        <Text style={styles.overline}>{label}</Text>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {children}
    </View>
  );
}
