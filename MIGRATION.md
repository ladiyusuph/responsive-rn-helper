# Migrating from 1.x to 2.0

**Your 1.x code keeps working in 2.x.** Every renamed API is still accepted. It's marked `@deprecated` (shown with a strikethrough in your editor) and logs one warning per API in development. The old names are removed in 3.0.

So you can upgrade first and migrate gradually. Work through the console warnings, or search your code for the old names below.

## 1. Tier names

The four tiers are now Material 3 window size classes. They're named for the space available, not the device.

| 1.x key        | 2.0 key    | Width (default) |
| -------------- | ---------- | --------------- |
| `small`        | `compact`  | < 600           |
| `phone`        | `compact`  | < 600           |
| `tablet`       | `medium`   | 600 – 839       |
| `largeTablet`  | `expanded` | 840 – 1199      |
| —              | `large`    | ≥ 1200 (new)    |

```diff
- columns={{ phone: 2, tablet: 3, largeTablet: 4 }}
+ columns={{ compact: 2, medium: 3, expanded: 4 }}
```

This applies everywhere a per-tier value goes: config tokens, `useResponsiveValue`, `ResponsiveGrid`'s `columns` and `itemHeight`.

**The one behavior change:** 1.x had a `small` tier for windows narrower than 320. No current phone is that narrow, so 2.0 has no such tier: `small` and `phone` both map to `compact`. A `small` value now only applies when there's no `phone` value.

### Breakpoints

```diff
- breakpoints: { smallPhone: 360, phone: 600, tablet: 840 }
+ breakpoints: { medium: 600, expanded: 840, large: 1200 }
```

1.x's breakpoint called `phone` was actually where the tablet tier started, which is why it becomes `medium`. `smallPhone` no longer defines a tier. Its only remaining use was `ResponsiveRow`'s stacking width, so pass `stackBelow` instead.

### ResponsiveShow / ResponsiveHide

```diff
- <ResponsiveShow above="tablet">
+ <ResponsiveShow above="medium">
```

| 1.x            | 2.0                                      |
| -------------- | ---------------------------------------- |
| `small-phone`, `phone` | `compact`                        |
| `tablet`       | `medium`                                 |
| `large-tablet` | `expanded` and `large` (`above="expanded"`) |

Conditions that still use the 1.x names are evaluated exactly as in 1.x.

## 2. Tokens: one source of truth

In 1.x some values existed twice with different defaults: `spacing.card` vs `layout.cardPadding`, `spacing.gap` vs `layout.gap`, and so on. In 2.0 each value lives in exactly one token group.

### Reading tokens from `useLayout()`

| 1.x                          | 2.0                           |
| ---------------------------- | ----------------------------- |
| `layout.horizontalPadding`   | `layout.spacing.screen`       |
| `layout.gap`                 | `layout.spacing.gap`          |
| `layout.sectionGap`          | `layout.spacing.section`      |
| `layout.cardPadding`         | `layout.spacing.card`         |
| `layout.inputPaddingHorizontal` | `layout.spacing.input`     |
| `layout.contentMaxWidth`     | `layout.containerMaxWidth`    |
| `layout.buttonHeight`        | `layout.sizes.buttonHeight`   |
| `layout.inputHeight`         | `layout.sizes.inputHeight`    |
| `layout.iconSize.md`         | `layout.iconSizes.md`         |
| `layout.borderRadius`        | a `radii` token, e.g. `layout.radii.lg` |
| `layout.actionColumns`, `layout.statColumns` | a token of your own in `sizes` (see below) |

### Flags from `useResponsive()` / `useLayout()`

| 1.x               | 2.0                        |
| ----------------- | -------------------------- |
| `deviceType`      | `tier`                     |
| `isPhone`         | `isBelow("medium")`        |
| `isTablet`        | `isAtLeast("medium")`      |
| `isLargeTablet`   | `isAtLeast("expanded")`    |
| `isSmallPhone`    | — (no tier below compact)  |

If you used `isTablet` to mean "this hardware is a tablet", use `formFactor === "tablet"`. Unlike width-based flags, it doesn't flip when a phone rotates to landscape.

### Configuring tokens

```diff
  <ResponsiveProvider
    config={{
-     layout: {
-       horizontalPadding: { phone: 16, tablet: 24 },
-       cardPadding: { phone: 16 },
-       buttonHeight: { minWidth: 320, maxWidth: 900, minValue: 48, maxValue: 56 },
-       iconSize: { md: { phone: 24 } },
-     },
+     spacing: {
+       screen: { compact: 16, medium: 24 },
+       card: 16,
+     },
+     sizes: { buttonHeight: fluid(48, 56, { from: 320, to: 900 }) },
+     iconSizes: { md: 24 },
    }}
  >
```

| 1.x config key                 | 2.0 config key             |
| ------------------------------ | -------------------------- |
| `layout.horizontalPadding`     | `spacing.screen`           |
| `layout.gap`                   | `spacing.gap`              |
| `layout.sectionGap`            | `spacing.section`          |
| `layout.cardPadding`           | `spacing.card`             |
| `layout.inputPaddingHorizontal`| `spacing.input`            |
| `layout.contentMaxWidth`       | `layout.containerMaxWidth` |
| `layout.buttonHeight`          | `sizes.buttonHeight`       |
| `layout.inputHeight`           | `sizes.inputHeight`        |
| `layout.iconSize`              | `iconSizes`                |
| `{ minWidth, maxWidth, minValue, maxValue }` | `fluid(minValue, maxValue, { from: minWidth, to: maxWidth })` |

Tokens can now be plain numbers (`card: 16`) when they don't change per tier.

### App-specific tokens

`actionColumns` and `statColumns` came from the app this library started in. Define your own instead:

```tsx
const config = defineConfig({
  sizes: { statColumns: { compact: 2, medium: 4 } },
});
// layout.sizes.statColumns
```

See "Custom tokens (typed)" in the README for how to get these typed.

## 3. Default values that changed

`compact` takes 1.x's `phone` values, so phones look the same. Two semantic tokens had two conflicting 1.x defaults; 2.0 keeps the one the components used:

| Token          | 1.x                                         | 2.0                         |
| -------------- | ------------------------------------------- | --------------------------- |
| `spacing.gap`  | 20 on large tablets (`layout.gap` was 24)   | 24 from `expanded`          |
| `spacing.card` | 12 on small phones (`layout.cardPadding` was 16) | 16 on `compact`        |

`large` (≥ 1200) is new and inherits `expanded` values unless you set it.

## 4. Removed

- `computeLayoutTokens()`: use `resolveTokens(normalizeConfig(config), width)`.
- `DEFAULT_RESPONSIVE_SPACING`, `DEFAULT_RESPONSIVE_RADII`, and the 1.x shape of `DEFAULT_LAYOUT` and `DEFAULT_BREAKPOINTS`: use `DEFAULT_SPACING`, `DEFAULT_RADII`, `DEFAULT_TYPOGRAPHY`, `DEFAULT_TEXT`, `DEFAULT_ICON_SIZES`, `DEFAULT_SIZES`, `DEFAULT_LAYOUT` and `DEFAULT_BREAKPOINTS` (2.0 shapes).
- 1.x config types `LayoutConfig`, `ResponsiveSpacingConfig`, `ResponsiveTypographyConfig`, `ResponsiveRadiiConfig`, `ResponsiveSizeValuesConfig`: use `ResponsiveConfigInput` / `TokenGroup`.
- Package layout: the build now lives in `dist/cjs`, `dist/esm` and `dist/types`. Import from `@ladiyusuph/responsive-rn`, not from `dist/...` paths.

Deprecated but still working: `responsiveValue()` (→ `resolveResponsive()`), `computeBreakpointFlags()` (→ `computeWindowClass()`), `matchesBreakpointCondition(deviceType, …)` (→ `matchesBreakpointCondition(width, …, breakpoints)`), the `ResponsiveConfigOverrides` type (→ `ResponsiveConfigInput`), and the `DeviceType` type (→ `Tier`).
