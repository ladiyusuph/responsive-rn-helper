# @ladiyusuph/responsive-rn

Responsive layout helpers for Expo and React Native: breakpoints, spacing, typography, radii, layout tokens, fluid values, grid/row/container components, and breakpoint-aware rendering.

## Setup

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

The package defaults are defaults, not React Native standards. They can be overridden by each application.

## Configure your design system

Use one `config` object when you want all responsive design decisions in one place:

```tsx
<ResponsiveProvider
  config={{
    breakpoints: {
      smallPhone: 375,
      phone: 600,
      tablet: 900,
    },
    spacing: {
      screen: { small: 12, phone: 20, tablet: 28, largeTablet: 36 },
      card: { small: 12, phone: 16, tablet: 20, largeTablet: 24 },
    },
    typography: {
      md: { small: 14, phone: 15, tablet: 16, largeTablet: 17 },
      xxl: { small: 20, phone: 22, tablet: 26, largeTablet: 30 },
    },
    radii: {
      md: { small: 8, phone: 10, tablet: 12, largeTablet: 14 },
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

Nested responsive values are deep-merged with the defaults, so you only need to provide values you want to change.

For convenience, the same configuration sections can be supplied directly:

```tsx
<ResponsiveProvider
  breakpoints={{ phone: 640, tablet: 900 }}
  spacing={{ screen: { phone: 20, tablet: 28 } }}
  typography={{ xxl: { phone: 22, tablet: 28 } }}
  radii={{ lg: { phone: 14, tablet: 16 } }}
  layout={{ actionColumns: { phone: 2, tablet: 3, largeTablet: 4 } }}
>
  <YourApp />
</ResponsiveProvider>
```

If both `config` and direct props are provided, direct props take precedence.

## Hooks

### `useLayout()`

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

### `useResponsiveSpacing()`

```tsx
const spacing = useResponsiveSpacing();

<View style={{ paddingHorizontal: spacing.screen, gap: spacing.gap }} />;
```

### `useResponsiveTypography()`

```tsx
const typography = useResponsiveTypography();

<Text style={{ fontSize: typography.xxl }}>Dashboard</Text>;
```

### `useResponsiveRadii()`

```tsx
const radii = useResponsiveRadii();

<View style={{ borderRadius: radii.md }} />;
```

### `useResponsiveValue()`

Use for discrete breakpoint changes:

```tsx
const padding = useResponsiveValue(
  { small: 12, phone: 16, tablet: 24, largeTablet: 32 },
  16,
);
```

### `useFluidValue()`

Use for smooth interpolation:

```tsx
const titleSize = useFluidValue(20, 32);
```

## Components

- `ResponsiveContainer`
- `ResponsiveRow`
- `ResponsiveGrid`
- `ResponsiveShow`
- `ResponsiveHide`
- `ResponsiveDebugOverlay`

## Design philosophy

The package separates responsive mechanics from application design decisions:

- Breakpoints decide when the layout changes.
- Responsive tokens decide what values are used at each tier.
- Flexbox decides how content fills available space.
- `useResponsiveValue()` handles discrete breakpoint changes.
- `useFluidValue()` handles smooth interpolation.

The package's defaults are intentionally overridable so applications can establish their own design system without editing the library source.
