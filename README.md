# @ladiyusuph/responsive-rn

Responsive layout primitives for Expo and React Native.

Build adaptive interfaces with configurable breakpoints, responsive design tokens, fluid values, containers, rows, grids, and breakpoint-aware rendering.

## Features

- Configurable responsive breakpoints
- Responsive spacing, typography, and radii
- Responsive design tokens
- Fluid values that scale smoothly with screen width
- Responsive containers
- Responsive rows
- Constraint-based responsive grids
- Breakpoint-aware rendering
- Responsive debug overlay
- Application-level configuration
- Designed for Expo and React Native

---

## Installation

```bash
npm install @ladiyusuph/responsive-rn
````

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
| ------------ | ------------: |
| `smallPhone` |         `360` |
| `phone`      |         `600` |
| `tablet`     |         `840` |

These values are layout thresholds, not device classifications.

---

# Configuration

You can configure your responsive system through a single `config` object.

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

Configuration values are deep-merged with the package defaults, so you only need to provide the values you want to change.

## Direct configuration

Configuration sections can also be supplied directly:

```tsx
<ResponsiveProvider
  breakpoints={{
    phone: 640,
    tablet: 900,
  }}
  spacing={{
    screen: {
      phone: 20,
      tablet: 28,
    },
  }}
  typography={{
    xxl: {
      phone: 22,
      tablet: 28,
    },
  }}
  radii={{
    lg: {
      phone: 14,
      tablet: 16,
    },
  }}
  layout={{
    actionColumns: {
      phone: 2,
      tablet: 3,
    },
  }}
>
  <YourApp />
</ResponsiveProvider>
```

If both `config` and direct props are provided, **direct props take precedence**.

---

# Hooks

## `useLayout()`

Provides responsive layout state and calculated layout tokens.

```tsx
const {
  horizontalPadding,
  contentMaxWidth,
  gap,
  sectionGap,
  cardPadding,
  borderRadius,
  actionColumns,
  statColumns,
  buttonHeight,
} = useLayout();
```

---

## `useResponsiveSpacing()`

Access responsive spacing tokens:

```tsx
const spacing = useResponsiveSpacing();

return (
  <View
    style={{
      paddingHorizontal: spacing.screen,
      gap: spacing.gap,
    }}
  />
);
```

---

## `useResponsiveTypography()`

Access responsive typography values:

```tsx
const typography = useResponsiveTypography();

return (
  <Text style={{ fontSize: typography.xxl }}>
    Dashboard
  </Text>
);
```

---

## `useResponsiveRadii()`

Access responsive border-radius values:

```tsx
const radii = useResponsiveRadii();

return (
  <View style={{ borderRadius: radii.md }} />
);
```

---

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

---

## `useFluidValue()`

Use when a value should scale smoothly rather than jump between breakpoints.

```tsx
const titleSize = useFluidValue(20, 32);
```

Useful for:

* Font sizes
* Spacing
* Component dimensions
* Other values that benefit from smooth scaling

Unlike `useResponsiveValue()`, `useFluidValue()` interpolates between the minimum and maximum values.

---

# Components

## `ResponsiveContainer`

Provides a centered content area with responsive horizontal padding and an optional maximum content width.

```tsx
<ResponsiveContainer>
  <YourContent />
</ResponsiveContainer>
```

Useful for preventing content from becoming excessively wide on tablets and larger screens.

---

## `ResponsiveRow`

Provides a horizontal layout that can automatically stack its children vertically on small phones.

```tsx
<ResponsiveRow gap={16}>
  <Button title="Cancel" />
  <Button title="Continue" />
</ResponsiveRow>
```

By default:

```text
Small phone → column
Phone+      → row
```

### Disable stacking

```tsx
<ResponsiveRow stackOnSmall={false}>
  <Button title="Cancel" />
  <Button title="Continue" />
</ResponsiveRow>
```

### Custom spacing

```tsx
<ResponsiveRow gap={24}>
  <Button title="Cancel" />
  <Button title="Continue" />
</ResponsiveRow>
```

If `gap` is omitted, the component uses the responsive layout gap from your configuration.

---

## `ResponsiveGrid`

Automatically determines how many columns can fit based on the **actual width available to the grid**.

Unlike a breakpoint-based grid, it does not rely only on screen width.

This makes it useful inside:

* `ResponsiveContainer`
* Cards
* Modals
* Split views
* Side panels
* Other constrained layouts

### Basic usage

```tsx
<ResponsiveGrid>
  <Card />
  <Card />
  <Card />
  <Card />
</ResponsiveGrid>
```

### Minimum item width

```tsx
<ResponsiveGrid minItemWidth={180}>
  <Card />
  <Card />
  <Card />
  <Card />
</ResponsiveGrid>
```

The grid uses `minItemWidth` as a layout constraint:

```text
Available width
       ↓
Minimum item width
       ↓
Calculate columns
       ↓
Render grid
```

### Custom spacing

```tsx
<ResponsiveGrid
  minItemWidth={160}
  gap={16}
>
  <Card />
  <Card />
  <Card />
</ResponsiveGrid>
```

### Limit columns

```tsx
<ResponsiveGrid
  minItemWidth={160}
  gap={16}
  maxColumns={4}
>
  <Card />
  <Card />
  <Card />
  <Card />
</ResponsiveGrid>
```

### Grid options

| Prop           | Default | Description                        |
| -------------- | ------: | ---------------------------------- |
| `minItemWidth` |   `160` | Minimum desired width of each item |
| `gap`          |    `12` | Space between grid items           |
| `minColumns`   |     `1` | Minimum number of columns          |
| `maxColumns`   |       — | Optional maximum number of columns |

> **ResponsiveRow is breakpoint-driven, while ResponsiveGrid is available-space-driven.**

---

## `ResponsiveShow`

Render content conditionally based on the current responsive breakpoint.

```tsx
<ResponsiveShow above="tablet">
  <DesktopNavigation />
</ResponsiveShow>
```

You can also target specific breakpoints:

```tsx
<ResponsiveShow
  only={["phone", "small-phone"]}
>
  <MobileNavigation />
</ResponsiveShow>
```

---

## `ResponsiveHide`

Hide content based on responsive breakpoints.

```tsx
<ResponsiveHide below="tablet">
  <DesktopNavigation />
</ResponsiveHide>
```

---

## `ResponsiveDebugOverlay`

Use the debug overlay during development to inspect the current responsive state.

```tsx
<ResponsiveDebugOverlay />
```

It is intended as a development tool rather than a production UI component.

---

# Choosing the right tool

| Requirement                                    | Use                                 |
| ---------------------------------------------- | ----------------------------------- |
| Change a value at a breakpoint                 | `useResponsiveValue()`              |
| Smoothly scale a value                         | `useFluidValue()`                   |
| Responsive spacing                             | `useResponsiveSpacing()`            |
| Responsive typography                          | `useResponsiveTypography()`         |
| Responsive border radius                       | `useResponsiveRadii()`              |
| Access multiple layout tokens                  | `useLayout()`                       |
| Center/constrain content                       | `ResponsiveContainer`               |
| Horizontal layout that stacks on small screens | `ResponsiveRow`                     |
| Automatically calculate grid columns           | `ResponsiveGrid`                    |
| Conditionally render by breakpoint             | `ResponsiveShow` / `ResponsiveHide` |
| Inspect responsive state during development    | `ResponsiveDebugOverlay`            |

---

# Complete example

The components and hooks are designed to work together.

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
  const { sectionGap } = useLayout();

  return (
    <ResponsiveContainer>
      <ResponsiveRow gap={16}>
        <Header />
        <Actions />
      </ResponsiveRow>

      <View style={{ marginTop: sectionGap }}>
        <ResponsiveGrid
          minItemWidth={160}
          gap={16}
          maxColumns={4}
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

# Design philosophy

The package separates **responsive mechanics** from **application design decisions**.

### Breakpoints

Breakpoints determine **when** the layout changes.

```text
smallPhone → phone → tablet
```

### Responsive tokens

Tokens determine **which values** are used at each responsive tier.

```text
padding
fontSize
borderRadius
spacing
```

### Flexbox

Flexbox determines how content fills the available space.

### `useResponsiveValue()`

Use when a value should change discretely at a breakpoint.

```text
12 → 16 → 24
```

### `useFluidValue()`

Use when a value should scale smoothly.

```text
20 ─────── smoothly ─────── 32
```

### Responsive components

Components such as `ResponsiveRow` and `ResponsiveGrid` provide higher-level responsive layout behavior.

In particular:

* `ResponsiveRow` responds to **breakpoints**
* `ResponsiveGrid` responds to **available space**

This allows applications to combine breakpoint-based decisions with fluid, constraint-based layouts.

---

# Customizing the design system

The library provides sensible starting values, but applications should define the values that make sense for their own design system.

You do **not** need to modify the library source code to establish your application's design system.

```tsx
<ResponsiveProvider
  config={{
    breakpoints: {
      smallPhone: 375,
      phone: 640,
      tablet: 900,
    },

    spacing: {
      screen: {
        small: 16,
        phone: 24,
        tablet: 32,
      },
    },

    typography: {
      xxl: {
        small: 22,
        phone: 26,
        tablet: 32,
      },
    },
  }}
>
  <App />
</ResponsiveProvider>
```

---

# Why use `@ladiyusuph/responsive-rn`?

React Native already provides powerful Flexbox primitives, but building a consistent responsive design system often requires repeating the same logic across screens.

This library provides reusable primitives for common responsive concerns without replacing React Native's layout system.

The goal is to make responsive behavior easier to configure, understand, and maintain.

---

# License

MIT

