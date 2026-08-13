# @responsive-rn

Responsive helpers for Expo/React Native.

## Core rule

Do not scale every pixel.

Use Flexbox for fluid width, fixed dimensions for deliberately fixed components, breakpoints for structural changes, and `clamp()` for bounded fluid values.

### App setup

```tsx
import { ResponsiveProvider } from "@thecodeunit/responsive-rn";

<ResponsiveProvider breakpoints={{ smallPhone: 360, phone: 600, tablet: 840 }}>
  <App />
</ResponsiveProvider>;
```

### Screen

```tsx
const layout = useLayout();
const spacing = useResponsiveSpacing();
const typography = useResponsiveTypography();

<ResponsiveContainer>
  <CustomText style={{ fontSize: typography.xl }}>Example Text</CustomText>

  <ResponsiveRow>
    <StatCard style={{ flex: 1 }} />
    <StatCard style={{ flex: 1 }} />
  </ResponsiveRow>
</ResponsiveContainer>;
```

### Cards

If a card is intentionally 120px high:

```tsx
<View
  style={{
    height: 120,
    padding: layout.cardPadding,
    borderRadius: layout.borderRadius,
  }}
>
  ...
</View>
```

Do NOT replace deliberate fixed height with `minHeight` unless growth is desired.

### Migration

Instead of:

```tsx
width: scale(160);
```

prefer:

```tsx
flex: 1;
```

when the item should share available width.

Instead of:

```tsx
height: verticalScale(120);
```

use:

```tsx
height: 120;
```

when the visual height is intentional.

Instead of:

```tsx
fontSize: moderateScale(22);
```

use a semantic typography token such as:

```tsx
fontSize: typography.xl;
```

### Fluid values

For a value that should scale continuously instead of jumping between tiers
— the direct equivalent of CSS `clamp()`:

```tsx
const heading = useFluidValue(20, 32); // 20px at smallPhone width, 32px at tablet width, interpolated in between
const cardPadding = useFluidValue(12, 24, { minWidth: 320, maxWidth: 900 });
```

### Show / hide by breakpoint

```tsx
<ResponsiveShow above="tablet">
  <Sidebar />
</ResponsiveShow>

<ResponsiveHide below="tablet">
  <DesktopOnlyToolbar />
</ResponsiveHide>

<ResponsiveShow only={["phone", "small-phone"]}>
  <BottomTabBar />
</ResponsiveShow>
```

`above`/`below` are inclusive of the named tier and combine as a range. `only`
overrides both.

### Debug overlay

Drop this anywhere near the root of your app during development to see the
live width/height and breakpoint tier on screen. It renders nothing outside
`__DEV__` unless you pass `forceShow`:

```tsx
<ResponsiveDebugOverlay position="bottom-right" />
```
