/**
 * Written only with 1.x APIs, all deprecated in 2.0. It should render the
 * same as it did on 1.x, and each API logs one deprecation warning in the
 * console naming its replacement. See MIGRATION.md.
 */
import { ScrollView, Text, View } from "react-native";
import {
  ResponsiveGrid,
  ResponsiveShow,
  useLayout,
  useResponsiveValue,
} from "@ladiyusuph/responsive-rn";

import { Tile } from "../components/Tile";
import { colors } from "../theme";

export function LegacyScreen() {
  const layout = useLayout();
  const columns = useResponsiveValue({ small: 1, phone: 2, tablet: 3, largeTablet: 4 }, 2);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: layout.horizontalPadding,
        paddingVertical: layout.sectionGap,
        gap: layout.sectionGap,
      }}
    >
      <View style={{ gap: layout.gap }}>
        <Text style={{ fontSize: layout.typography["2xl"], fontWeight: "700", color: colors.text }}>
          1.x compatibility
        </Text>
        <Text style={{ fontSize: layout.typography.md, color: colors.muted }}>
          Every value on this screen comes from a deprecated 1.x API. Open the console to see one
          warning per API, each naming its 2.0 replacement.
        </Text>
      </View>

      <View
        style={{
          padding: layout.cardPadding,
          borderRadius: layout.borderRadius,
          backgroundColor: colors.surface,
          gap: layout.gap,
        }}
      >
        <Text style={{ fontSize: layout.typography.sm, color: colors.muted }}>
          deviceType: {layout.deviceType} · isPhone: {String(layout.isPhone)} · isTablet:{" "}
          {String(layout.isTablet)} · isLargeTablet: {String(layout.isLargeTablet)}
        </Text>
        <Text style={{ fontSize: layout.typography.sm, color: colors.muted }}>
          cardPadding {layout.cardPadding} · gap {layout.gap} · buttonHeight{" "}
          {Math.round(layout.buttonHeight)} · iconSize.md {layout.iconSize.md} · useResponsiveValue
          columns {columns}
        </Text>
        <ResponsiveShow above="tablet">
          <Text style={{ fontSize: layout.typography.sm, color: colors.primary }}>
            {'<ResponsiveShow above="tablet"> is visible'}
          </Text>
        </ResponsiveShow>
      </View>

      <ResponsiveGrid columns={{ phone: 2, tablet: 3, largeTablet: 4 }} gap={layout.gap} itemHeight={{ phone: 96, tablet: 120 }}>
        {Array.from({ length: 6 }, (_, index) => (
          <Tile key={index} label={`1.x item ${index + 1}`} />
        ))}
      </ResponsiveGrid>
    </ScrollView>
  );
}
