import { Pressable, ScrollView, Text, View } from "react-native";
import {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveHide,
  ResponsiveRow,
  ResponsiveShow,
  TIERS,
  createStyles,
  useFluidValue,
  useLayout,
  type SpacingKey,
  type TextVariantKey,
  type TypographyKey,
} from "@ladiyusuph/responsive-rn";

import { Section } from "../components/Section";
import { Tile } from "../components/Tile";
import { colors } from "../theme";

const SPACING_KEYS: SpacingKey[] = ["xs", "sm", "md", "lg", "xl", "xxl", "xxxl", "gap", "card", "screen", "section", "hero"];
const TYPE_KEYS: TypographyKey[] = ["xs", "sm", "md", "lg", "xl", "xxl", "2xl", "3xl"];
const TEXT_KEYS: TextVariantKey[] = ["display", "heading", "title", "bodyLarge", "body", "label", "caption", "overline"];

const useStyles = createStyles((t) => ({
  scroll: { paddingVertical: t.spacing.section },
  stack: { gap: t.spacing.section },
  header: { gap: t.spacing.sm },
  overline: { ...t.text.overline, color: colors.muted },
  display: { ...t.text.display, color: colors.text },
  body: { ...t.text.body, color: colors.muted },
  mono: { ...t.text.caption, color: colors.muted, fontVariant: ["tabular-nums"] },

  ladder: { flexDirection: "row", gap: t.spacing.xs },
  rung: {
    flex: 1,
    paddingVertical: t.spacing.sm,
    borderRadius: t.radii.md,
    alignItems: "center",
    backgroundColor: colors.background,
  },
  rungLabel: { ...t.text.label, color: colors.muted },
  rungLabelActive: { color: colors.primaryText },
  facts: { flexDirection: "row", flexWrap: "wrap", columnGap: t.spacing.lg, rowGap: t.spacing.xs },

  profile: {
    // Stacked and centered on phones, side by side from medium up.
    flexDirection: { compact: "column", medium: "row" },
    alignItems: { compact: "center", medium: "flex-start" },
    gap: t.spacing.lg,
    padding: t.spacing.hero,
    borderRadius: t.radii.xxl,
    backgroundColor: colors.primarySoft,
  },
  avatar: {
    width: t.sizes.avatar,
    height: t.sizes.avatar,
    borderRadius: t.radii.pill,
    backgroundColor: colors.primary,
  },
  profileText: { flex: { medium: 1 }, alignItems: { compact: "center", medium: "flex-start" } },
  profileName: { ...t.text.heading, color: colors.text },

  barRow: { flexDirection: "row", alignItems: "center", gap: t.spacing.md },
  barLabel: { ...t.text.caption, color: colors.muted, width: 64 },
  bar: { height: 10, borderRadius: t.radii.sm, backgroundColor: colors.primary },
  sample: { color: colors.text },

  button: {
    // flex: 1 shares the row's width; minHeight (not height) keeps the
    // button tall once ResponsiveRow stacks it into a column.
    flex: 1,
    minHeight: t.sizes.buttonHeight,
    borderRadius: t.radii.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  buttonSecondary: { backgroundColor: colors.primarySoft },
  buttonLabel: { ...t.text.button, color: colors.primaryText },
  buttonLabelSecondary: { color: colors.primary },

  badges: { flexDirection: "row", flexWrap: "wrap", gap: t.spacing.sm },
  badge: {
    paddingVertical: t.spacing.xs,
    paddingHorizontal: t.spacing.md,
    borderRadius: t.radii.pill,
    backgroundColor: colors.background,
  },
  badgeText: { ...t.text.label, color: colors.text },
  fluidBar: { borderRadius: t.radii.md, backgroundColor: colors.tiers.medium },
}));

export function ShowcaseScreen() {
  const styles = useStyles();
  const layout = useLayout();
  const fluidHeight = useFluidValue(24, 96);

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <ResponsiveContainer style={styles.stack}>
        <View style={styles.header}>
          <Text style={styles.overline}>@ladiyusuph/responsive-rn</Text>
          <Text style={styles.display}>One layout, every screen</Text>
          <Text style={styles.body}>
            Rotate the device, use split view, or resize the browser window: everything below
            adapts.
          </Text>
        </View>

        <Section label="useResponsive" title="Window" description="Tiers follow width. Form factor follows the shortest side, so it survives rotation.">
          <View style={styles.ladder}>
            {TIERS.map((tier) => {
              const active = tier === layout.tier;
              return (
                <View key={tier} style={[styles.rung, active && { backgroundColor: colors.tiers[tier] }]}>
                  <Text style={[styles.rungLabel, active && styles.rungLabelActive]}>{tier}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.facts}>
            <Text style={styles.mono}>{Math.round(layout.width)} × {Math.round(layout.height)}</Text>
            <Text style={styles.mono}>formFactor: {layout.formFactor}</Text>
            <Text style={styles.mono}>{layout.isLandscape ? "landscape" : "portrait"}</Text>
            <Text style={styles.mono}>fontScale: {layout.fontScale}</Text>
          </View>
        </Section>

        <Section label="createStyles" title="Per-tier styles" description="flexDirection, alignment and padding change per tier. The avatar size and padding are custom tokens.">
          <View style={styles.profile}>
            <View style={styles.avatar} />
            <View style={styles.profileText}>
              <Text style={styles.profileName}>Ada Lovelace</Text>
              <Text style={styles.body}>Analyst, programmer and the first to see what computers could become.</Text>
            </View>
          </View>
        </Section>

        <Section label="Tokens" title="Spacing" description="The static scale, the semantic tokens, and the custom `hero` token, at the current tier.">
          {SPACING_KEYS.map((key) => (
            <View key={key} style={styles.barRow}>
              <Text style={styles.barLabel}>{key} · {layout.spacing[key]}</Text>
              <View style={[styles.bar, { width: layout.spacing[key] * 3 }]} />
            </View>
          ))}
        </Section>

        <Section label="Tokens" title="Typography and text variants">
          {TYPE_KEYS.map((key) => (
            <Text key={key} style={[styles.sample, { fontSize: layout.typography[key] }]} numberOfLines={1}>
              {key} · {layout.typography[key]}px
            </Text>
          ))}
          {TEXT_KEYS.map((key) => (
            <Text key={key} style={[layout.text[key], styles.sample]} numberOfLines={1}>
              {key} · {layout.text[key].fontSize}/{layout.text[key].lineHeight ?? "auto"}
            </Text>
          ))}
        </Section>

        <Section label="ResponsiveRow" title="Stacks when cramped" description="These buttons stack when the row is narrower than 480, or when the system font size is 130% or more.">
          <ResponsiveRow stackBelow={480} stackAtFontScale={1.3}>
            <Pressable style={[styles.button, styles.buttonSecondary]}>
              <Text style={[styles.buttonLabel, styles.buttonLabelSecondary]}>Not now</Text>
            </Pressable>
            <Pressable style={styles.button}>
              <Text style={styles.buttonLabel}>Continue</Text>
            </Pressable>
          </ResponsiveRow>
        </Section>

        <Section label="ResponsiveGrid" title="Explicit columns" description="2 / 3 / 4 / 6 columns per tier, square cells. Correct from the very first frame.">
          <ResponsiveGrid columns={{ compact: 2, medium: 3, expanded: 4, large: 6 }} gap={layout.spacing.gap} aspectRatio={1}>
            {Array.from({ length: 7 }, (_, index) => (
              <Tile key={index} label={`Item ${index + 1}`} />
            ))}
          </ResponsiveGrid>
        </Section>

        <Section label="ResponsiveGrid" title="Auto-fit" description="As many 140pt columns as fit in the grid's own width (max 5), with a stretched last row and per-tier height.">
          <ResponsiveGrid minItemWidth={140} maxColumns={5} gap={layout.spacing.gap} itemHeight={{ compact: 88, medium: 112 }} stretchLastRow>
            {Array.from({ length: 8 }, (_, index) => (
              <Tile key={index} label={`Card ${index + 1}`} />
            ))}
          </ResponsiveGrid>
        </Section>

        <Section label="ResponsiveShow / ResponsiveHide" title="Render per tier">
          <View style={styles.badges}>
            <ResponsiveShow only="compact">
              <View style={styles.badge}><Text style={styles.badgeText}>Only on compact</Text></View>
            </ResponsiveShow>
            <ResponsiveShow above="medium">
              <View style={styles.badge}><Text style={styles.badgeText}>Medium and up</Text></View>
            </ResponsiveShow>
            <ResponsiveShow above="expanded">
              <View style={styles.badge}><Text style={styles.badgeText}>Expanded and up</Text></View>
            </ResponsiveShow>
            <ResponsiveHide below="expanded">
              <View style={styles.badge}><Text style={styles.badgeText}>Hidden below expanded</Text></View>
            </ResponsiveHide>
          </View>
        </Section>

        <Section label="useFluidValue" title="Fluid values" description="Height grows smoothly from 24 to 96 as the window widens, with no jumps at breakpoints.">
          <View style={[styles.fluidBar, { height: fluidHeight }]} />
          <Text style={styles.mono}>{fluidHeight.toFixed(1)}pt</Text>
        </Section>
      </ResponsiveContainer>
    </ScrollView>
  );
}
