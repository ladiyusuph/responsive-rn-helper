# @ladiyusuph/responsive-rn

A responsive design system for Expo and React Native.

Define your spacing, type, radii and sizes once, per screen size. Then build screens from tokens and layout primitives instead of repeating breakpoint logic in every component.

- **Window size tiers**: `compact` / `medium` / `expanded` / `large` (Material 3 window size classes)
- **Design tokens**: spacing, radii, typography, text styles, icon sizes and component sizes, all responsive
- **Your own tokens**: add any token name, fully typed
- **`createStyles`**: StyleSheet-style factory with per-tier style values
- **Fluid values** that scale smoothly with screen width
- **Layout primitives**: container, row, grid, show/hide
- **Grid helpers** for `FlatList` / `FlashList`
- **Container-aware layout**: components react to the space they actually get
- **Phone vs tablet detection** that survives rotation
- No dependencies beyond `react` and `react-native`

> Upgrading from 1.x? Your code keeps working. See [MIGRATION.md](MIGRATION.md).

> Want to see it first? The [example app](example/) shows every feature and runs on iOS, Android and web.

---

## Installation

```bash
npm install @ladiyusuph/responsive-rn
```

Requires `react >= 17` and `react-native >= 0.71`.

## Setup

Wrap your app with `ResponsiveProvider`:

```tsx
import { ResponsiveProvider } from "@ladiyusuph/responsive-rn";

export default function App() {
  return (
    <ResponsiveProvider>
      <YourApp />
    </ResponsiveProvider>
  );
}
```

That's enough to use the defaults. Hooks also work without a provider, using the defaults.

---

## Quick start

```tsx
import { Text, View } from "react-native";
import { createStyles } from "@ladiyusuph/responsive-rn";

const useStyles = createStyles((t) => ({
  screen: {
    paddingHorizontal: t.spacing.screen,
    gap: t.spacing.section,
  },
  card: {
    padding: t.spacing.card,
    borderRadius: t.radii.lg,
    // Stack on phones, side by side from tablets up.
    flexDirection: { compact: "column", medium: "row" },
    gap: t.spacing.gap,
  },
  title: t.text.title,
  body: t.text.body,
}));

export function Profile() {
  const styles = useStyles();

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Ada Lovelace</Text>
        <Text style={styles.body}>Analyst, programmer, visionary.</Text>
      </View>
    </View>
  );
}
```

---

# Tiers

Every responsive value is keyed by **tier**, a range of window widths:

| Tier       | Width        | Typically                                              |
| ---------- | ------------ | ------------------------------------------------------ |
| `compact`  | < 600        | Phones in portrait                                     |
| `medium`   | 600 – 839    | Tablets in portrait, foldables, phones in landscape    |
| `expanded` | 840 – 1199   | Tablets in landscape                                   |
| `large`    | ≥ 1200       | Large tablets in landscape, desktop / web              |

These are [Material 3 window size classes](https://m3.material.io/foundations/layout/applying-layout/window-size-classes). Tiers describe **available space, not hardware**. A phone in landscape can be `expanded`, which is usually right for layout. When you really mean the device, use [`formFactor`](#phone-or-tablet-formfactor).

### Mobile-first values

A tier without its own value uses the nearest **smaller** tier's value:

```tsx
{ compact: 1, expanded: 3 }

// compact  → 1
// medium   → 1   (inherits compact)
// expanded → 3
// large    → 3   (inherits expanded)
```

Define only the tiers where something changes.

### Custom breakpoints

```tsx
<ResponsiveProvider config={{ breakpoints: { medium: 640, expanded: 1024, large: 1440 } }}>
```

---

# Design tokens

| Group        | Default tokens                                                                 |
| ------------ | ------------------------------------------------------------------------------ |
| `spacing`    | scale `xs` `sm` `md` `lg` `xl` `xxl` `xxxl` + semantic `screen` `section` `card` `gap` `input` |
| `radii`      | `sm` `md` `lg` `xl` `xxl`                                                      |
| `typography` | font sizes `xxs` `xs` `sm` `md` `lg` `xl` `xxl` `2xl` `3xl`                    |
| `text`       | text styles `caption` `label` `body` `bodyLarge` `title` `heading` `display`   |
| `iconSizes`  | `xs` `sm` `md` `lg` `xl`                                                       |
| `sizes`      | `buttonHeight` `inputHeight`                                                   |

### Default values

| Token              | compact | medium | expanded |
| ------------------ | ------: | -----: | -------: |
| `spacing.screen`   |      16 |     24 |       32 |
| `spacing.section`  |      24 |     32 |       40 |
| `spacing.card`     |      16 |     20 |       24 |
| `spacing.gap`      |      12 |     16 |       24 |
| `spacing.input`    |      16 |     20 |       20 |
| `typography.md`    |      14 |     15 |       16 |
| `typography.2xl`   |      22 |     28 |       32 |
| `radii.lg`         |      16 |     16 |       16 |
| `radii.xxl`        |      24 |     28 |       32 |
| `iconSizes.md`     |      24 |     24 |       28 |
| `sizes.inputHeight` |     48 |     52 |       56 |

`sizes.buttonHeight` is fluid: 48 at 320 wide, growing smoothly to 56 at 900.

The spacing scale is static: `xs` 4, `sm` 8, `md` 12, `lg` 16, `xl` 20, `xxl` 24, `xxxl` 32. `large` inherits from `expanded` unless you set it. All defaults are exported (`DEFAULT_SPACING`, `DEFAULT_TYPOGRAPHY`, …) if you want the full table.

> These are package defaults, not platform standards: sensible starting points (8pt grid, 48dp touch targets, 24pt icons) meant to be replaced by your own design system.

## Token values

Every token can be:

```tsx
spacing: {
  sm: 8,                                   // the same everywhere
  screen: { compact: 16, medium: 24 },     // per tier
  hero: fluid(32, 64),                     // scales smoothly with width
}
```

`fluid(min, max, { from, to })` goes from `min` at `from` (default 320) to `max` at `to` (default: the `expanded` breakpoint).

## Text variants

`text` tokens are complete text styles built on the typography scale:

```tsx
text: {
  body:    { fontSize: "md", lineHeight: 1.5 },
  heading: { fontSize: "2xl", lineHeight: 1.25, fontWeight: "700" },
}
```

`fontSize` names a `typography` token (or gives a size directly). `lineHeight` is a multiplier, like unitless CSS line-height, resolved to an absolute value for React Native:

```tsx
const { text } = useLayout();
<Text style={text.heading}>Welcome</Text>   // { fontSize: 22, lineHeight: 28, fontWeight: "700" } on a phone
```

---

# Configuration

Pass a config to the provider. Everything is optional and merged over the defaults:

```tsx
<ResponsiveProvider
  config={{
    spacing: {
      screen: { medium: 32 },        // per-tier maps merge tier by tier
    },
    radii: { lg: 20 },
    typography: { md: { compact: 15, medium: 16 } },
  }}
>
```

Per-tier maps merge **tier by tier**, so `screen: { medium: 32 }` keeps the default `compact` and `expanded` values. A plain value replaces the token outright.

Each group can also be passed as its own prop (`spacing={...}`, `breakpoints={...}`), which overrides the same group in `config`.

## Custom tokens (typed)

Add any token to any group. To get autocomplete and type errors for your own names, define the config with `defineConfig` and register its type once:

```tsx
// theme.ts
import { defineConfig, fluid } from "@ladiyusuph/responsive-rn";

export const config = defineConfig({
  spacing: { hero: { compact: 48, medium: 80 } },
  sizes: { avatar: 40, fab: fluid(56, 72) },
  text: {
    button: { fontSize: "md", fontWeight: "600", letterSpacing: 0.5 },
  },
});

declare module "@ladiyusuph/responsive-rn" {
  interface Register {
    config: typeof config;
  }
}
```

```tsx
// App.tsx
<ResponsiveProvider config={config}>
```

```tsx
const { spacing, sizes, text } = useLayout();
spacing.hero;   // number ✓
sizes.avatar;   // number ✓
text.button;    // text style ✓
spacing.heroo;  // type error
```

---

# Hooks

## `useLayout()`

Everything in one object: window info plus every token resolved for the current tier.

```tsx
const layout = useLayout();

layout.tier;              // "compact" | "medium" | "expanded" | "large"
layout.width;             // window width
layout.formFactor;        // "phone" | "tablet"
layout.spacing.card;
layout.radii.lg;
layout.typography.md;
layout.text.body;
layout.iconSizes.md;
layout.sizes.buttonHeight;
layout.containerMaxWidth; // number | undefined
layout.isAtLeast("medium");
```

## `createStyles()`

Like `StyleSheet.create`, but the factory receives every token (the same object as `useLayout()`), and any style property can take one value per tier.

```tsx
const useStyles = createStyles((t) => ({
  grid: {
    flexDirection: { compact: "column", expanded: "row" },
    gap: t.spacing.gap,
    padding: { compact: t.spacing.md, medium: t.spacing.xl },
  },
  heading: { ...t.text.heading, color: "#111" },
}));

function Screen() {
  const styles = useStyles();
  return <View style={styles.grid}>{/* … */}</View>;
}
```

Style values stay fully typed: `flexDirection: { compact: "diagonal" }` is a type error, and `styles.grid.flexDirection` is typed `"column" | "row"`. A property with no value for the current tier is left out.

## `useResponsive()`

Window size and classification, without tokens:

```tsx
const { width, height, tier, formFactor, isLandscape, shortestSide, fontScale, breakpoints, isAtLeast, isBelow } =
  useResponsive();

isAtLeast("medium"); // tier is medium or larger
isBelow("expanded"); // tier is compact or medium
```

### Phone or tablet: `formFactor`

`tier` follows the width, so a phone in landscape (e.g. 932pt wide) is `expanded`. `formFactor` uses the shortest side of the screen, so it doesn't change when the device rotates:

```tsx
// iPhone 15 Pro Max, landscape
tier       → "expanded"
formFactor → "phone"   // shortest side 430 < 600
```

`formFactor` is `"tablet"` when the shortest side is at least the `medium` breakpoint (600 by default, Android's `sw600dp`).

## `useResponsiveValue()`

Pick a value per tier, anywhere:

```tsx
const columns = useResponsiveValue({ compact: 1, medium: 2, expanded: 3 }, 1);
```

## `useFluidValue()`

Scale a value smoothly instead of jumping at breakpoints:

```tsx
const titleSize = useFluidValue(20, 32); // 20 at 320 wide → 32 at the expanded breakpoint
const custom = useFluidValue(12, 18, { minWidth: 360, maxWidth: 1200 });
```

## Token group hooks

When a component needs only one group:

```tsx
useResponsiveSpacing();
useResponsiveTypography();
useResponsiveRadii();
useResponsiveIconSizes();
useResponsiveSizes();
useTextVariants();
```

These only re-render when the tier changes (or on every width change for groups containing fluid tokens).

## `useContainerWidth()`

Measures the width a view actually receives from its parent, for components that respond to their own space rather than the screen's:

```tsx
const { width, onLayout } = useContainerWidth();

return (
  <View onLayout={onLayout}>
    {width !== null && width < 400 ? <CompactCard /> : <WideCard />}
  </View>
);
```

`width` is `null` until the first layout pass.

## `useGridLayout()`

`ResponsiveGrid`'s column logic for virtualized lists:

```tsx
const { width, onLayout } = useContainerWidth();
const { numColumns, itemWidth, gap } = useGridLayout({ width, minItemWidth: 160, maxColumns: 4 });

<View style={{ flex: 1 }} onLayout={onLayout}>
  <FlatList
    key={numColumns} // FlatList can't change numColumns on the fly
    data={items}
    numColumns={numColumns}
    columnWrapperStyle={numColumns > 1 ? { gap } : undefined}
    contentContainerStyle={{ gap }}
    renderItem={({ item }) => <ProductCard item={item} style={{ width: itemWidth }} />}
  />
</View>
```

Takes the same `columns`, `minItemWidth`, `gap`, `minColumns` and `maxColumns` options as `ResponsiveGrid`. `width` defaults to the window width.

---

# Components

## `ResponsiveContainer`

Centers content with `spacing.screen` horizontal padding, capped at `layout.containerMaxWidth` (800 on medium, 1040 from expanded up) so lines stay readable on wide screens.

```tsx
<ResponsiveContainer>
  <YourContent />
</ResponsiveContainer>
```

## `ResponsiveRow`

A row that stacks its children vertically when there isn't room.

```tsx
<ResponsiveRow stackBelow={480} stackAtFontScale={1.3}>
  <Button title="Cancel" />
  <Button title="Continue" />
</ResponsiveRow>
```

The row measures **its own width**, so it stacks in a narrow sidebar or modal even on a tablet.

> **Tip:** children that use `flex: 1` to share the row's width get `flexBasis: 0`, which collapses their height once the row stacks into a column. Give them `minHeight` instead of `height`.

| Prop               | Default         | Description                                              |
| ------------------ | --------------- | -------------------------------------------------------- |
| `stackBelow`       | `320`           | Width below which the row stacks                         |
| `stackAtFontScale` | —               | Also stack when the user's font scale is at least this   |
| `stackOnSmall`     | `true`          | Set to `false` to never stack                            |
| `measureContainer` | `true`          | Measure the row's own width instead of the window width  |
| `gap`              | `spacing.gap`   | Space between children                                   |

## `ResponsiveGrid`

A grid that fits as many columns as the space allows, or exactly the number you ask for.

```tsx
// Auto-fit: as many columns of at least 160 as fit in the grid's own width
<ResponsiveGrid minItemWidth={160} maxColumns={4}>
  <Card /><Card /><Card /><Card />
</ResponsiveGrid>

// Explicit: a set number of columns per tier
<ResponsiveGrid columns={{ compact: 2, medium: 3, expanded: 4 }}>
  <Card /><Card /><Card /><Card />
</ResponsiveGrid>
```

Cell widths come from flexbox, so every row fills the grid exactly (no sub-pixel gaps or unexpected wrapping). Items in a short last row keep the same width as everyone else, unless you set `stretchLastRow`.

| Prop             | Default | Description                                                  |
| ---------------- | ------: | ------------------------------------------------------------ |
| `columns`        |       — | Exact column count, plain or per tier. Disables auto-fit     |
| `minItemWidth`   |   `160` | Auto-fit: minimum width of each item                         |
| `minColumns`     |     `1` | Auto-fit: minimum number of columns                          |
| `maxColumns`     |       — | Auto-fit: maximum number of columns                          |
| `gap`            |    `12` | Space between items, horizontally and vertically             |
| `itemHeight`     |       — | Height of every item, plain or per tier                      |
| `aspectRatio`    |       — | Width-to-height ratio of every item (e.g. `1`, `16 / 9`)     |
| `stretchLastRow` | `false` | Let items in a short last row share the row                  |

**Item sizing.** By default each item's height comes from its content (items in a row stretch to match the tallest). Use `itemHeight` for a fixed or per-tier height, or `aspectRatio` to derive height from width (image and media grids). If both are given, `itemHeight` wins and a development warning is shown.

**First frame.** With explicit `columns`, the grid is correct on the very first frame: per-tier columns follow the screen's tier, and nothing depends on measuring the container. In auto-fit mode the first frame uses the window width, and the grid settles once its own width has been measured.

**Long lists.** `ResponsiveGrid` renders every child. For long or infinite lists, use [`useGridLayout()`](#usegridlayout) with `FlatList` or `FlashList`.

**Geometry vs content.** The grid owns each cell's width, height and position; the component you put inside owns its padding, typography and colors. Give your card `flex: 1` to fill its cell:

```tsx
function HomeCard() {
  return <View style={{ flex: 1, padding: 16 }}>{/* … */}</View>;
}
```

## `ResponsiveShow` / `ResponsiveHide`

Render content only at some tiers:

```tsx
<ResponsiveShow above="expanded">
  <Sidebar />
</ResponsiveShow>

<ResponsiveHide below="medium">
  <DesktopNavigation />
</ResponsiveHide>

<ResponsiveShow only={["compact", "medium"]}>
  <BottomTabs />
</ResponsiveShow>
```

`above` and `below` are inclusive and combine as a range; `only` takes precedence over both.

## `ResponsiveDebugOverlay`

A development-only badge showing the window size, tier and orientation. Tap it for breakpoints, form factor and font scale. Renders nothing in production unless you pass `forceShow`.

```tsx
<ResponsiveDebugOverlay position="bottom-right" />
```

---

# Choosing the right tool

| Requirement                                       | Use                                   |
| ------------------------------------------------- | ------------------------------------- |
| Styles that use tokens and change per tier        | `createStyles()`                      |
| All tokens and window info in a component         | `useLayout()`                         |
| One value that changes per tier                   | `useResponsiveValue()`                |
| A value that scales smoothly                      | `useFluidValue()` / `fluid()`         |
| Your own design tokens, typed                     | `defineConfig()` + `Register`         |
| Centered, padded, width-capped content            | `ResponsiveContainer`                 |
| Side-by-side content that stacks when cramped     | `ResponsiveRow`                       |
| A grid of cards                                   | `ResponsiveGrid`                      |
| Grid columns for a long FlatList / FlashList      | `useGridLayout()`                     |
| React to a component's own width                  | `useContainerWidth()`                 |
| Render something only at some tiers               | `ResponsiveShow` / `ResponsiveHide`   |
| Phone vs tablet hardware, regardless of rotation  | `useResponsive().formFactor`          |

---

# Pure helpers

The logic behind the hooks is exported as pure functions, handy for tests or non-React code: `getTier`, `resolveResponsive`, `resolveBreakpoints`, `normalizeConfig`, `resolveTokens`, `resolveStyles`, `computeWindowClass`, `computeGridLayout`, `fluidValue`, `matchesBreakpointCondition`.

---

# License

MIT
