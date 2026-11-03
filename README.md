# @ladiyusuph/responsive-rn

Responsive layout primitives for Expo and React Native.

Build adaptive interfaces with configurable breakpoints, responsive design tokens, fluid values, containers, rows, grids, and breakpoint-aware rendering.

## Features

- Configurable responsive breakpoints
- Responsive spacing, typography, radii, and icons
- Responsive design tokens
- Fluid values that scale smoothly with screen width
- Responsive containers
- Responsive rows
- Constraint-based responsive grids
- Fixed, responsive, and aspect-ratio grid item sizing
- Trailing row expansion
- Breakpoint-aware rendering
- Responsive debug overlay
- Application-level configuration
- Designed for Expo and React Native

---

## Installation

```bash
npm install @ladiyusuph/responsive-rn
```


or:

```bash
yarn add @ladiyusuph/responsive-rn
```

The package requires `react` and `react-native` as peer dependencies.

---

## Setup

Wrap your application with `ResponsiveProvider`:

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

---

# Defaults

The package provides sensible defaults for common responsive layouts.

> **Note:** These values are package defaults, not React Native or platform standards. They are intentionally configurable so each application can establish its own design system.

### Default breakpoints

| Breakpoint   | Default width |
| ------------ | ------------- |
| `smallPhone` | `320`         |
| `phone`      | `600`         |
| `tablet`     | `840`         |

These values are layout thresholds, not device classifications.

`smallPhone` is deliberately low: a row inside a 16px-padded container on a 390pt iPhone measures 358pt and should still lay out as a row.

> **Landscape phones:** tiers are width-based, so a phone in landscape (e.g. 852pt wide) lands in the `large-tablet` tier. That's usually what you want for layout (there really is more horizontal space), but not always for sizing. Use `formFactor` from `useResponsive()` when you need to know whether the hardware is a phone or a tablet — see [Device form factor](#device-form-factor).

---

# Configuration

You can configure your responsive system through a single `config` object.

Configuration values are deep-merged with the package defaults, so you only need to provide the values you want to change.

```tsx
<ResponsiveProvider
  config={{
    breakpoints: {
      smallPhone: 375,
      phone: 600,
      tablet: 900,
    },

    spacing: {
      screen: {
        small: 12,
        phone: 20,
        tablet: 28,
      },
      card: {
        small: 12,
        phone: 16,
        tablet: 20,
      },
    },

    typography: {
      md: {
        small: 14,
        phone: 15,
        tablet: 16,
      },
      xxl: {
        small: 20,
        phone: 22,
        tablet: 26,
      },
    },

    radii: {
      md: {
        small: 8,
        phone: 10,
        tablet: 12,
      },
    },

    layout: {
      buttonHeight: {
        minWidth: 320,
        maxWidth: 1000,
        minValue: 48,
        maxValue: 58,
      },
    },
  }}
>
  <YourApp />
</ResponsiveProvider>
```

## Direct configuration

Configuration sections can also be supplied directly as props on the provider.

If both `config` and direct props are provided, **direct props take precedence**.

---

# Hooks

## `useLayout()` (Recommended)

`useLayout` is the primary convenience API for building components.

Instead of calling individual token hooks, it provides a centralized object containing responsive layout tokens, spacing, radii, typography, and icons.

```tsx
import { View } from "react-native";
import { useLayout } from "@ladiyusuph/responsive-rn";

export function CustomCard() {
  const layout = useLayout();

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: layout.radii.xl,
        padding: layout.spacing.card,
        gap: layout.gap,
      }}
    >
      {/* Content */}
    </View>
  );
}
```

---

## Individual Token Hooks

If you prefer to extract specific domains, you can use the individual hooks.

### `useResponsiveSpacing()`

Access responsive spacing tokens:

```tsx
const spacing = useResponsiveSpacing();

spacing.screen;
spacing.card;
spacing.gap;
```

### `useResponsiveTypography()`

Access responsive typography values:

```tsx
const typography = useResponsiveTypography();

typography.md;
typography.xxl;
```

### `useResponsiveRadii()`

Access responsive border-radius values:

```tsx
const radii = useResponsiveRadii();

radii.md;
radii.xl;
```

### `useResponsiveIconSizes()`

Access responsive icon size tokens:

```tsx
const icons = useResponsiveIconSizes();

icons.md;
icons.lg;
```

---

# Dynamic Values

## `useResponsiveValue()`

Use when a value should change discretely between breakpoints.

```tsx
const padding = useResponsiveValue(
  {
    small: 12,
    phone: 16,
    tablet: 24,
  },
  16,
);
```

Responsive values cascade to the nearest available lower tier when a value is not explicitly defined.

For example:

```tsx
const height = useResponsiveValue(
  {
    phone: 140,
    tablet: 160,
  },
  140,
);
```

On a small phone, the `phone` value is inherited.

This allows applications to define only the values that actually need to change.

---

## `useFluidValue()`

Use when a value should scale smoothly rather than jump between breakpoints.

```tsx
const titleSize = useFluidValue(20, 32);
```

Unlike `useResponsiveValue()`, `useFluidValue()` interpolates continuously between the minimum and maximum values as the available width changes.

---

## Device form factor

`useResponsive()` returns the raw window size plus breakpoint flags. Alongside the width-based `deviceType`, it exposes an orientation-independent `formFactor`:

```tsx
const { deviceType, formFactor, shortestSide, isLandscape } = useResponsive();

// iPhone 15 Pro Max, landscape:
// deviceType   → "large-tablet"   (932pt wide)
// formFactor   → "phone"          (shortest side 430 < phone breakpoint)
```

`formFactor` is `"tablet"` when the shortest side is at least the `phone` breakpoint (600 by default — the same threshold as Android's `sw600dp`).

---

## `useContainerWidth()`

Measures the width a view actually receives from its parent. This is what `ResponsiveGrid` and `ResponsiveRow` use internally, exposed so you can build your own container-aware components.

```tsx
const { width, onLayout } = useContainerWidth();

return (
  <View onLayout={onLayout}>
    {width !== null && width < 400 ? <CompactCard /> : <WideCard />}
  </View>
);
```

`width` is `null` until the first layout pass.

---

## `useGridLayout()`

Column count and item width for virtualized lists, computed with the same rules as `ResponsiveGrid`. `ResponsiveGrid` renders every child, so use this with `FlatList` or `FlashList` for long lists.

```tsx
const { width, onLayout } = useContainerWidth();
const { numColumns, itemWidth, gap } = useGridLayout({
  width, // optional — defaults to the window width
  minItemWidth: 160,
  maxColumns: 4,
});

<View style={{ flex: 1 }} onLayout={onLayout}>
  <FlatList
    key={numColumns} // FlatList can't change numColumns on the fly
    data={items}
    numColumns={numColumns}
    columnWrapperStyle={numColumns > 1 ? { gap } : undefined}
    contentContainerStyle={{ gap }}
    renderItem={({ item }) => (
      <ProductCard item={item} style={{ width: itemWidth }} />
    )}
  />
</View>
```

Accepts the same `columns`, `minItemWidth`, `gap`, `minColumns` and `maxColumns` options as `ResponsiveGrid`.

---

# Components

## `ResponsiveContainer`

Provides a centered content area with responsive horizontal padding and an optional maximum content width.

```tsx
<ResponsiveContainer>
  <YourContent />
</ResponsiveContainer>
```

---

## `ResponsiveRow`

Provides a horizontal layout that can automatically stack its children vertically on small phones.

```tsx
<ResponsiveRow gap={16}>
  <Button title="Cancel" />
  <Button title="Continue" />
</ResponsiveRow>
```

By default the row stacks when **its own measured width** is narrower than the `smallPhone` breakpoint (320 by default):

```text
< smallPhone → column
≥ smallPhone → row
```

Because it measures itself, a row inside a narrow sidebar or modal stacks even on a tablet. Pass `measureContainer={false}` to use the window width instead.

Choose your own threshold with `stackBelow`, and stack for large accessibility text with `stackAtFontScale`:

```tsx
<ResponsiveRow stackBelow={480} stackAtFontScale={1.3}>
  <Button title="Cancel" />
  <Button title="Continue" />
</ResponsiveRow>
```

| Prop               | Default             | Description                                              |
| ------------------ | ------------------- | -------------------------------------------------------- |
| `stackBelow`       | `smallPhone` (320)  | Width below which the row stacks                         |
| `stackAtFontScale` | —                   | Also stack when the user's font scale is at least this   |
| `stackOnSmall`     | `true`              | Set to `false` to never stack                            |
| `measureContainer` | `true`              | Measure the row's own width instead of the window width  |
| `gap`              | layout `gap` token  | Space between children                                   |

---

# ResponsiveGrid

`ResponsiveGrid` is a constraint-based grid that automatically determines how many columns can fit based on the **actual width available to the grid**.

Unlike a breakpoint-only grid, it does not rely solely on device or screen width.

This makes it suitable for:

- dashboards
- cards
- nested containers
- split views
- side panels
- tablets
- landscape layouts
- responsive administrative interfaces

```tsx
<ResponsiveGrid>
  <Card />
  <Card />
  <Card />
  <Card />
</ResponsiveGrid>
```

The grid measures its actual container width and calculates the number of columns using:

```text
available width
minimum item width
gap
minimum columns
maximum columns
```

---

## Grid Geometry

`ResponsiveGrid` supports three item-sizing modes.

### 1. Natural height

If neither `itemHeight` nor `aspectRatio` is supplied, the grid does not impose a height on its cells.

```tsx
<ResponsiveGrid>
  <Card />
  <Card />
</ResponsiveGrid>
```

The child determines its own height.

This is the most flexible option.

---

### 2. Fixed height

Use `itemHeight` when every grid item should have the same height.

```tsx
<ResponsiveGrid itemHeight={140}>
  <Card />
  <Card />
  <Card />
  <Card />
</ResponsiveGrid>
```

The height remains:

```text
Small phone → 140
Phone       → 140
Tablet      → 140
Large tablet → 140
```

This is useful when you want **exactly the same card height across all devices**.

For example:

```tsx
<ResponsiveGrid minItemWidth={160} gap={12} itemHeight={140}>
  <HomeCard />
  <HomeCard />
</ResponsiveGrid>
```

The grid controls the geometry while `HomeCard` remains responsible only for its content.

---

### 3. Responsive height

If the height should change at different responsive tiers, pass a responsive value.

```tsx
<ResponsiveGrid
  itemHeight={{
    small: 120,
    phone: 140,
    tablet: 160,
  }}
>
  <Card />
  <Card />
</ResponsiveGrid>
```

The grid resolves the height using the same responsive breakpoint system used by the rest of the library.

You can also provide only the values that need to change:

```tsx
<ResponsiveGrid
  itemHeight={{
    phone: 140,
    tablet: 160,
  }}
>
  <Card />
  <Card />
</ResponsiveGrid>
```

The responsive value resolver cascades to the nearest available value when a tier is not explicitly defined.

---

### 4. Aspect-ratio sizing

Use `aspectRatio` when the item's height should be calculated automatically from its width.

```tsx
<ResponsiveGrid aspectRatio={1}>
  <Card />
  <Card />
  <Card />
  <Card />
</ResponsiveGrid>
```

This creates square cells:

```text
width = 180 → height = 180
width = 200 → height = 200
width = 240 → height = 240
```

For a 16:9 layout:

```tsx
<ResponsiveGrid aspectRatio={16 / 9}>
  <VideoCard />
  <VideoCard />
</ResponsiveGrid>
```

This is useful for:

- image grids
- media cards
- product cards
- thumbnails
- square dashboard widgets

---

## `itemHeight` vs `aspectRatio`

These two props represent different geometry strategies.

| Requirement                     | Use                    |
| ------------------------------- | ---------------------- |
| Let content determine height    | Nothing                |
| Same height on every device     | `itemHeight={140}`     |
| Different height at breakpoints | `itemHeight={{ ... }}` |
| Square items                    | `aspectRatio={1}`      |
| 16:9 items                      | `aspectRatio={16 / 9}` |
| Fluid height based on width     | `aspectRatio`          |

Do not use `itemHeight` and `aspectRatio` together.

If both are supplied, `itemHeight` takes precedence and a development warning is emitted.

---

## Basic Grid

```tsx
<ResponsiveGrid gap={16} minItemWidth={160}>
  <Card />
  <Card />
  <Card />
  <Card />
</ResponsiveGrid>
```

---

## Maximum columns

```tsx
<ResponsiveGrid gap={16} minItemWidth={160} maxColumns={4}>
  <Card />
  <Card />
  <Card />
  <Card />
</ResponsiveGrid>
```

Even if more columns could physically fit, the grid will never exceed `maxColumns`.

---

## Minimum columns

```tsx
<ResponsiveGrid gap={16} minItemWidth={160} minColumns={2}>
  <Card />
  <Card />
</ResponsiveGrid>
```

This allows the application to enforce a minimum column count.

---

## Stretching the last row

By default, incomplete rows retain their normal cell width.

```tsx
<ResponsiveGrid gap={16} minItemWidth={160} maxColumns={4}>
  <Card />
  <Card />
  <Card />
</ResponsiveGrid>
```

If the grid produces four columns, the third card remains the width of one normal cell.

Set `stretchLastRow` to `true` to allow incomplete final rows to expand:

```tsx
<ResponsiveGrid gap={16} minItemWidth={160} maxColumns={4} stretchLastRow>
  <Card />
  <Card />
  <Card />
</ResponsiveGrid>
```

This is useful for dashboard layouts where the final row should consume the available space.

---

## Grid options

| Prop             | Default | Description                                 |
| ---------------- | ------: | ------------------------------------------- |
| `columns`        |       — | Exact column count (number or per-breakpoint); disables auto-fit |
| `minItemWidth`   |   `160` | Minimum desired width of each item          |
| `gap`            |    `12` | Horizontal and vertical space between items |
| `minColumns`     |     `1` | Minimum number of columns                   |
| `maxColumns`     |       — | Maximum number of columns                   |
| `itemHeight`     |       — | Fixed or responsive height for each item    |
| `aspectRatio`    |       — | Width-to-height ratio for each item         |
| `stretchLastRow` | `false` | Expands items on an incomplete final row    |

> **Important:** in auto-fit mode, `ResponsiveGrid` calculates its column count from the actual width available to the grid, not simply the device screen width. Cell widths come from flexbox, so every row fills the grid exactly — no sub-pixel gaps or unexpected wrapping.

---

## Explicit columns

Pass `columns` when you want a fixed column count instead of auto-fit:

```tsx
<ResponsiveGrid columns={2}>...</ResponsiveGrid>

<ResponsiveGrid columns={{ small: 1, phone: 2, tablet: 3, largeTablet: 4 }}>
  ...
</ResponsiveGrid>
```

Per-breakpoint `columns` (and `itemHeight`) follow the **screen** breakpoint, like every other responsive value. Because explicit columns don't depend on measuring the container, the grid is laid out correctly on the very first frame. In auto-fit mode the first frame uses the window width, and the grid settles once its container has been measured.

`minItemWidth`, `minColumns` and `maxColumns` are ignored when `columns` is set.

---

## Grid and content components

`ResponsiveGrid` owns **geometry**.

The component placed inside the grid owns **content**.

For example:

```tsx
function HomeCard() {
  return (
    <View
      style={{
        flex: 1,
        padding: 16,
      }}
    >
      {/* Card content */}
    </View>
  );
}
```

Then:

```tsx
<ResponsiveGrid minItemWidth={160} gap={12} itemHeight={140}>
  <HomeCard />
  <HomeCard />
</ResponsiveGrid>
```

The grid determines:

```text
width
height
columns
gap
position
```

The card determines:

```text
padding
content
typography
icons
colors
```

This separation allows the same content component to be used inside a grid, row, list, or ordinary `View` without making it aware of the grid implementation.

---

## Long lists

`ResponsiveGrid` renders all of its children at once. For long or infinite lists, use [`useGridLayout()`](#usegridlayout) with `FlatList` / `FlashList` to get the same column logic with virtualization.

---

## ResponsiveGrid vs ResponsiveRow

These components solve different problems.

### `ResponsiveRow`

Breakpoint-driven:

```text
small phone → column
phone       → row
tablet      → row
```

Use it when the layout decision is based on a responsive breakpoint.

### `ResponsiveGrid`

Available-space-driven:

```text
available width
       ↓
minimum item width
       ↓
number of columns
       ↓
cell geometry
```

Use it when the layout should adapt to the amount of space actually available.

---

# ResponsiveShow / ResponsiveHide

Render or hide content conditionally based on the current responsive breakpoint.

```tsx
<ResponsiveShow above="tablet">
  <DesktopNavigation />
</ResponsiveShow>

<ResponsiveHide below="tablet">
  <DesktopNavigation />
</ResponsiveHide>
```

---

# ResponsiveDebugOverlay

Use the debug overlay during development to inspect the current responsive state.

```tsx
<ResponsiveDebugOverlay />
```

---

# Choosing the right tool

| Requirement                                    | Use                                   |
| ---------------------------------------------- | ------------------------------------- |
| Access all responsive layout variables at once | `useLayout()`                         |
| Change a value at a breakpoint                 | `useResponsiveValue()`                |
| Smoothly scale a value continuously            | `useFluidValue()`                     |
| Center/constrain content                       | `ResponsiveContainer`                 |
| Horizontal layout that stacks on small screens | `ResponsiveRow`                       |
| Automatically calculate grid columns           | `ResponsiveGrid`                      |
| Same grid height across all devices            | `ResponsiveGrid itemHeight={...}`     |
| Responsive grid height                         | `ResponsiveGrid itemHeight={{ ... }}` |
| Maintain an aspect ratio                       | `ResponsiveGrid aspectRatio={...}`    |
| Conditionally render by breakpoint             | `ResponsiveShow` / `ResponsiveHide`   |
| Grid columns for a long FlatList / FlashList   | `useGridLayout()`                     |
| React to a component's own width               | `useContainerWidth()`                 |
| Phone vs tablet hardware, regardless of rotation | `useResponsive().formFactor`        |

---

# Complete Example

The components and hooks are designed to work together cleanly.

```tsx
import React from "react";
import { View } from "react-native";
import {
  ResponsiveContainer,
  ResponsiveRow,
  ResponsiveGrid,
  useLayout,
} from "@ladiyusuph/responsive-rn";

export function Dashboard() {
  const layout = useLayout();

  return (
    <ResponsiveContainer>
      <ResponsiveRow gap={layout.gap}>
        <Header />
        <Actions />
      </ResponsiveRow>

      <View
        style={{
          marginTop: layout.spacing.section,
        }}
      >
        <ResponsiveGrid
          gap={layout.gap}
          maxColumns={4}
          minItemWidth={160}
          itemHeight={140}
          stretchLastRow
        >
          <StatCard />
          <StatCard />
          <StatCard />
          <StatCard />
        </ResponsiveGrid>
      </View>
    </ResponsiveContainer>
  );
}
```

---

# Design Philosophy

The package separates **responsive mechanics** from **application design decisions**.

### Breakpoints

Breakpoints determine **when** the layout changes.

```text
smallPhone → phone → tablet
```

### Responsive tokens

Tokens determine **which values** are used at each responsive tier.

Examples:

```text
padding
fontSize
spacing
radii
iconSize
```

### Fluid values

Fluid values scale continuously with available width.

### Flexbox

React Native Flexbox determines how content fills available space.

### Responsive components

Higher-level primitives provide reusable layout behavior.

In particular:

- `ResponsiveRow` responds to **breakpoints**.
- `ResponsiveGrid` responds to **available space**.
- `ResponsiveContainer` controls content constraints.
- Grid cells control **geometry**.
- Child components control **content**.

This separation keeps application components simple while allowing the layout system to handle responsive behavior consistently.

---

# Customizing the Design System

The library provides sensible starting values, but applications should define the values that make sense for their own design system.

You do **not** need to modify the library source code.

Configure the system through `ResponsiveProvider`:

```tsx
<ResponsiveProvider
  config={{
    breakpoints: {
      smallPhone: 375,
      phone: 600,
      tablet: 900,
    },
  }}
>
  <App />
</ResponsiveProvider>
```

---

# Why use `@ladiyusuph/responsive-rn`?

React Native already provides powerful Flexbox primitives, but building a consistent responsive design system often requires repeating the same logic across screens.

`@ladiyusuph/responsive-rn` provides reusable primitives for common responsive concerns without replacing React Native's layout system.

The goal is to make responsive behavior:

- predictable
- configurable
- reusable
- composable
- easy to understand
- easy to maintain

---

# License

MIT

````
