import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useResponsive } from "../hooks/useResponsive";

declare const __DEV__: boolean | undefined;

export type ResponsiveDebugOverlayProps = {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /**
   * Force the overlay to render even outside __DEV__. Off by default so it
   * can never accidentally ship visible in a production build.
   */
  forceShow?: boolean;
};

/**
 * Dev-only overlay showing the current width/height and tier, so
 * you can sanity check layout at real device sizes instead of guessing from
 * the simulator's window title. Tap it to expand the full breakpoint config.
 * Renders nothing unless __DEV__ is true (or forceShow is passed).
 */
export function ResponsiveDebugOverlay({
  position = "bottom-right",
  forceShow = false,
}: ResponsiveDebugOverlayProps) {
  const [expanded, setExpanded] = useState(false);
  const { width, height, tier, formFactor, fontScale, isLandscape, breakpoints } =
    useResponsive();

  const isDev = typeof __DEV__ !== "undefined" && __DEV__;
  if (!isDev && !forceShow) return null;

  return (
    <View pointerEvents="box-none" style={[styles.container, POSITION_STYLES[position]]}>
      <Pressable onPress={() => setExpanded((value) => !value)} style={styles.badge}>
        <Text style={styles.text}>
          {Math.round(width)}×{Math.round(height)} · {tier} · {isLandscape ? "landscape" : "portrait"}
        </Text>
        {expanded && (
          <View style={styles.details}>
            <Text style={styles.detailText}>compact &lt; {breakpoints.medium}</Text>
            <Text style={styles.detailText}>medium &lt; {breakpoints.expanded}</Text>
            <Text style={styles.detailText}>expanded &lt; {breakpoints.large}</Text>
            <Text style={styles.detailText}>large ≥ {breakpoints.large}</Text>
            <Text style={styles.detailText}>form factor: {formFactor}</Text>
            <Text style={styles.detailText}>font scale: {fontScale}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const POSITION_STYLES: Record<NonNullable<ResponsiveDebugOverlayProps["position"]>, object> = {
  "top-left": { top: 40, left: 8 },
  "top-right": { top: 40, right: 8 },
  "bottom-left": { bottom: 24, left: 8 },
  "bottom-right": { bottom: 24, right: 8 },
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 9999,
  },
  badge: {
    backgroundColor: "rgba(0,0,0,0.78)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  text: {
    color: "#fff",
    fontSize: 11,
  },
  details: {
    marginTop: 4,
    gap: 1,
  },
  detailText: {
    color: "#ddd",
    fontSize: 10,
  },
});
