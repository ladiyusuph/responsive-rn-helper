# Changelog

All notable changes to this project are documented here. This project follows [Semantic Versioning](https://semver.org/).

## [Unreleased] — 2.0.0

A responsive design system rather than a set of helpers. **1.x code keeps working**: renamed APIs are deprecated, not removed. See [MIGRATION.md](MIGRATION.md).

### Added

- **Tiers** `compact` / `medium` / `expanded` / `large` (Material 3 window size classes), with mobile-first resolution. New `large` tier from 1200.
- **Token groups** `spacing` (static scale + semantic), `radii`, `typography`, `iconSizes`, `sizes` — each token a number, a per-tier map, or `fluid(min, max)`.
- **Text variants** (`text`): complete text styles with font size, line-height multiplier and weight. Defaults: `caption`, `label`, `body`, `bodyLarge`, `title`, `heading`, `display`.
- **Custom tokens with types**: add any token name to any group; `defineConfig()` + `declare module … { interface Register { config: typeof config } }` makes them typed everywhere.
- **`createStyles()`**: StyleSheet-style factory that receives all tokens and accepts per-tier style values, fully typed.
- `useResponsive()` / `useLayout()`: `tier`, `isAtLeast(tier)`, `isBelow(tier)`.
- `useLayout()`: `containerMaxWidth`, `sizes`, `text`, `iconSizes`.
- Hooks `useResponsiveSizes()` and `useTextVariants()`.
- `fluid()` token helper.
- Pure helpers `getTier`, `resolveResponsive`, `resolveBreakpoints`, `normalizeConfig`, `resolveTokens`, `resolveStyles`, `computeWindowClass`.
- ES module build (`dist/esm`, via the `module` field) next to CommonJS (`dist/cjs`).
- MIGRATION.md.
- Expo example app (`example/`) showing every feature, including a screen written only with 1.x APIs.

### Changed

- Every value now lives in exactly one token group (1.x had `spacing.card` and `layout.cardPadding`, `spacing.gap` and `layout.gap`, etc., with different defaults). `ResponsiveContainer` uses `spacing.screen` and `layout.containerMaxWidth`; `ResponsiveRow` uses `spacing.gap`.
- Defaults: `compact` uses 1.x's phone values. `spacing.gap` is 24 from `expanded` (was 20 in `spacing`, 24 in `layout`); `spacing.card` is 16 on compact (was 12 on small phones).
- Token group hooks only re-render when the tier changes (or on width changes, for groups with fluid tokens).
- Build output moved to `dist/cjs`, `dist/esm` and `dist/types`.

### Deprecated (still working, removed in 3.0)

- 1.x tier keys `small` / `phone` / `tablet` / `largeTablet` in responsive values, and device names in `ResponsiveShow` / `ResponsiveHide`.
- Breakpoints `smallPhone` / `phone` / `tablet`.
- Flat `useLayout()` tokens (`horizontalPadding`, `cardPadding`, `gap`, …) and `useResponsive()` flags (`deviceType`, `isPhone`, `isTablet`, …).
- `layout.*` config keys that moved to token groups, and `{ minWidth, maxWidth, minValue, maxValue }` fluid configs.
- `responsiveValue()`, `computeBreakpointFlags()`, `matchesBreakpointCondition(deviceType, …)`, types `DeviceType` and `ResponsiveConfigOverrides`.

### Removed

- `computeLayoutTokens()`, `DEFAULT_RESPONSIVE_SPACING`, `DEFAULT_RESPONSIVE_RADII`, and the 1.x config types (`LayoutConfig`, `ResponsiveSpacingConfig`, …).
- The sub-320 `small` tier: `small` values map to `compact`, used only when there's no `phone` value.

## [Unreleased] — 1.1.0

### Added

- `useGridLayout()` — column count and item width for `FlatList` / `FlashList`, using the same rules as `ResponsiveGrid`.
- `useContainerWidth()` — measure the width a view actually receives (the hook behind `ResponsiveGrid` and `ResponsiveRow`).
- `formFactor` (`"phone" | "tablet"`) and `shortestSide` on `useResponsive()` / `computeBreakpointFlags()`, so a phone in landscape can be told apart from a tablet.
- `ResponsiveRow` props `stackBelow` (custom stacking width) and `stackAtFontScale` (stack for large accessibility text).
- `ResponsiveDebugOverlay` shows form factor and font scale when expanded.
- Pure helpers `computeGridPlaceholderCount`, `computeGridLayout`, `computeSpacingTokens`, `computeTypographyTokens`, `computeRadiiTokens`, `computeIconSizeTokens` and `isDeepEqual`.
- `repository`, `homepage` and `bugs` links in `package.json`.
- CI workflow (typecheck, tests, build).

### Fixed

- `ResponsiveGrid` cells now fill the row exactly. Previously each cell was floored and shrunk by 0.5px, leaving up to ~1.5px per cell of empty space on the right. Cell widths now come from flexbox, with no pixel math.
- `ResponsiveGrid` with explicit `columns` is correct on the first frame. Previously the first render used the window width and wrapped into fewer columns inside padded containers, then jumped after measuring.
- `ResponsiveGrid` with `stretchLastRow`: cells on the last row now share it equally, instead of sizing to their content.
- `ResponsiveGrid` with `aspectRatio` keeps working with the new cell sizing.
- README now documents the grid's `columns` prop.
- Default typography: `2xl` and `3xl` were larger on small phones than on phones (24/28 vs 22/26). Small phones now use 22/26.
- README and source comments said the default `smallPhone` breakpoint was 360; it is 320.

### Performance

- `useLayout()` now subscribes to window dimensions once instead of ~19 times (once per token).
- `useResponsive()` returns a memoized object, so `useMemo`s that depend on it actually cache.
- Token hooks (`useResponsiveSpacing`, `useResponsiveTypography`, `useResponsiveRadii`, `useResponsiveIconSizes`) recompute only when the breakpoint tier changes, and keep the same object identity within a tier.
- `ResponsiveProvider` with an inline `config={{...}}` no longer re-renders every consumer on each parent render.

### Changed

- `ResponsiveGrid` per-breakpoint `columns` and `itemHeight` maps now follow the screen breakpoint, like every other responsive value, instead of the grid's measured width. This only differs when a padded container straddles a breakpoint.
- `ResponsiveGrid` renders invisible spacer views (row breaks and short-last-row placeholders) alongside its cells. Vertical spacing comes from the row breaks, so the grid container's own `rowGap` is now 0.

- Peer dependencies now declare real minimums: `react >= 17`, `react-native >= 0.71` (required for `gap` / `rowGap` / `columnGap`).
