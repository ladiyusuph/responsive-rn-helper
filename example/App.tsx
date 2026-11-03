import { useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  ResponsiveDebugOverlay,
  ResponsiveHide,
  ResponsiveProvider,
  ResponsiveShow,
  createStyles,
} from "@ladiyusuph/responsive-rn";

import { SideNav, TabBar, type ScreenKey } from "./src/components/Navigation";
import { LegacyScreen } from "./src/screens/LegacyScreen";
import { ListScreen } from "./src/screens/ListScreen";
import { ShowcaseScreen } from "./src/screens/ShowcaseScreen";
import { colors, config } from "./src/theme";

export default function App() {
  return (
    <SafeAreaProvider>
      <ResponsiveProvider config={config}>
        <Shell />
        <ResponsiveDebugOverlay position="top-right" />
      </ResponsiveProvider>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

const useStyles = createStyles(() => ({
  safeArea: { flex: 1, backgroundColor: colors.background },
  // Side rail next to the content from expanded up; tabs under it below.
  body: { flex: 1, flexDirection: { compact: "column", expanded: "row" } },
  content: { flex: 1 },
}));

function Shell() {
  const styles = useStyles();
  const [screen, setScreen] = useState<ScreenKey>("showcase");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        <ResponsiveShow above="expanded">
          <SideNav current={screen} onSelect={setScreen} />
        </ResponsiveShow>

        <View style={styles.content}>
          {screen === "showcase" && <ShowcaseScreen />}
          {screen === "list" && <ListScreen />}
          {screen === "legacy" && <LegacyScreen />}
        </View>

        <ResponsiveHide above="expanded">
          <TabBar current={screen} onSelect={setScreen} />
        </ResponsiveHide>
      </View>
    </SafeAreaView>
  );
}
