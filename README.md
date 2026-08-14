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
- Constraint-based responsive grids (with trailing row expansion)
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

## Defaults

The package provides sensible defaults for common responsive layouts.

> **Note:** These values are package defaults, not React Native or platform standards. They are intentionally configurable so each application can establish its own design system.

### Default breakpoints

| Breakpoint   | Default width |
| ------------ | ------------- |
| `smallPhone` | `360`         |
| `phone`      | `600`         |
| `tablet`     | `840`         |

These values are layout thresholds, not device classifications.

---

# Configuration

You can configure your responsive system through a single `config` object. Configuration values are deep-merged with the package defaults, so you only need to provide the values you want to change.

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

Configuration sections can also be supplied directly as props on the provider. If both `config` and direct props are provided, **direct props take precedence**.

---

# Hooks

## `useLayout()` (Recommended)

`useLayout` is the primary convenience API for building components. Instead of calling individual token hooks, it provides a centralized object containing all your current responsive layout tokens, spacing, radii, typography, and icons.

```tsx
import { useLayout } from "@ladiyusuph/responsive-rn";

export function CustomCard() {
  const layout = useLayout();

  return (
    <View "white", backgroundColor: borderRadius: gap: layout.gap, layout.radii.xl, layout.spacing.card, padding: style="{{" }}>
      <Icon name="person" size="{layout.icons.md}"/>
      <Text fontSize: layout.typography.md style="{{" }}>
        Profile
      </Text>
    </View>
  );
}

```

---

## Individual Token Hooks

If you prefer to extract specific domains or are optimizing component re-renders, you can use the individual hooks:

### `useResponsiveSpacing()`

Access responsive spacing tokens:

```tsx
const spacing = useResponsiveSpacing();
// spacing.screen, spacing.card, spacing.gap...
```

### `useResponsiveTypography()`

Access responsive typography values:

```tsx
const typography = useResponsiveTypography();
// typography.md, typography.xxl...
```

### `useResponsiveRadii()`

Access responsive border-radius values:

```tsx
const radii = useResponsiveRadii();
// radii.md, radii.xl...
```

### `useResponsiveIconSizes()`

Access responsive icon size tokens:

```tsx
const icons = useResponsiveIconSizes();
// icons.md, icons.lg...
```

---

## Dynamic Value Hooks

### `useResponsiveValue()`

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

### `useFluidValue()`

Use when a value should scale smoothly rather than jump between breakpoints.

```tsx
const titleSize = useFluidValue(20, 32);
```

Unlike `useResponsiveValue()`, `useFluidValue()` interpolates dynamically between the minimum and maximum values as the screen resizes.

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
<ResponsiveRow gap="{16}">
  <Button title="Cancel" />
  <Button title="Continue" />
</ResponsiveRow>
```

By default:

```text
Small phone → column
Phone+      → row

```

---

## `ResponsiveGrid`

Automatically determines how many columns can fit based on the **actual width available to the grid**. Unlike a breakpoint-based grid, it does not rely only on screen width, making it perfect for nested containers, cards, split views, and side panels.

### Basic usage

```tsx
<ResponsiveGrid gap="{16}" minItemWidth="{160}">
  <Card />
  <Card />
  <Card />
  <Card />
</ResponsiveGrid>
```

### Stretch last row

```tsx
<ResponsiveGrid gap="{16}" maxColumns="{4}" minItemWidth="{160}" stretchLastRow>
  <Card />
  <Card />
  <Card />
</ResponsiveGrid>
```

`ResponsiveGrid` automatically calculates the number of columns based on the available container width and `minItemWidth`. When `stretchLastRow` is enabled, items on an incomplete final row expand to elegantly consume the remaining space.

> **Note:** `stretchLastRow` defaults to `false`, ensuring that existing `ResponsiveGrid` implementations retain their previous fixed-width behavior.

### Grid options

| Prop             | Default | Description                                                             |
| ---------------- | ------- | ----------------------------------------------------------------------- |
| `minItemWidth`   | `160`   | Minimum desired width of each item                                      |
| `gap`            | `12`    | Space between grid items                                                |
| `minColumns`     | `1`     | Minimum number of columns to allow                                      |
| `maxColumns`     | —       | Optional maximum number of columns                                      |
| `stretchLastRow` | `false` | Whether incomplete trailing rows should expand to fill horizontal space |

> **ResponsiveRow is breakpoint-driven, while ResponsiveGrid is available-space-driven.**

---

## `ResponsiveShow` / `ResponsiveHide`

Render or hide content conditionally based on the current responsive breakpoint.

```tsx
<ResponsiveShow above="tablet">
  <DesktopNavigation/>
</ResponsiveShow>

<ResponsiveHide below="tablet">
  <DesktopNavigation/>
</ResponsiveHide>

```

---

## `ResponsiveDebugOverlay`

Use the debug overlay during development to inspect the current responsive state.

```tsx
<ResponsiveDebugOverlay />
```

---

# Choosing the right tool

| Requirement                                    | Use                                 |
| ---------------------------------------------- | ----------------------------------- |
| Access all responsive layout variables at once | `useLayout()`                       |
| Change a value abruptly at a breakpoint        | `useResponsiveValue()`              |
| Smoothly scale a value continuously            | `useFluidValue()`                   |
| Center/constrain content                       | `ResponsiveContainer`               |
| Horizontal layout that stacks on small screens | `ResponsiveRow`                     |
| Automatically calculate grid columns           | `ResponsiveGrid`                    |
| Conditionally render by breakpoint             | `ResponsiveShow` / `ResponsiveHide` |

---

# Complete example

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
      <ResponsiveRow gap="{layout.gap}">
        <Header/>
        <Actions/>
      </ResponsiveRow>

      <View layout.spacing.section marginTop: style="{{" }}>
        <ResponsiveGrid gap="{layout.gap}" maxColumns="{4}" minItemWidth="{160}" stretchLastRow>
          <StatCard/>
          <StatCard/>
          <StatCard/>
          <StatCard/>
        </ResponsiveGrid>
      </View>
    </ResponsiveContainer>
  );
}

```

---

# Design philosophy

The package separates **responsive mechanics** from **application design decisions**.

### Breakpoints

Breakpoints determine **when** the layout changes (`smallPhone → phone → tablet`).

### Responsive tokens

Tokens determine **which values** are used at each responsive tier (`padding`, `fontSize`, `spacing`).

### Flexbox

Flexbox determines how content fills the available space.

### Responsive components

Components such as `ResponsiveRow` and `ResponsiveGrid` provide higher-level responsive layout behavior. In particular:

- `ResponsiveRow` responds to **breakpoints**.
- `ResponsiveGrid` responds to **available space**.

This allows applications to combine breakpoint-based decisions with fluid, constraint-based layouts.

---

# Customizing the design system

The library provides sensible starting values, but applications should define the values that make sense for their own design system. You do **not** need to modify the library source code to establish your application's design system—just configure the `ResponsiveProvider`.

---

# Why use `@ladiyusuph/responsive-rn`?

React Native already provides powerful Flexbox primitives, but building a consistent responsive design system often requires repeating the same logic across screens.

This library provides reusable primitives for common responsive concerns without replacing React Native's layout system. The goal is to make responsive behavior easier to configure, understand, and maintain.

---

# License

MIT

```

```
