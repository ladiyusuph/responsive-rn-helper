# Changelog

All notable changes to this project are documented here. This project follows [Semantic Versioning](https://semver.org/).

## [2.0.0] — 2026-11-03

A responsive design system rather than a set of helpers. **1.x code keeps working**: renamed APIs are deprecated, not removed. See [MIGRATION.md](MIGRATION.md).

### Added

- **Tiers** `compact` / `medium` / `expanded` / `large` (Material 3 window size classes), with mobile-first resolution. New `large` tier from 1200.
- **Token groups** `spacing` (static scale + semantic), `radii`, `typography`, `iconSizes`, `sizes` — each token a number, a per-tier map, or `fluid(min, max)`.
- **Text variants** (`text`): complete text styles with font size, line-height multiplier and weight. Defaults: `caption`, `label`, `body`, `bodyLarge`, `title`, `heading`, `display`.
- **Custom tokens with types**: add any token name to any group; `defineConfig()` + `declare module … { interface Register { config: typeof config } }` makes them typed everywhere.
- **`createStyles()`**: StyleSheet-style factory that receives all tokens and accepts per-tier style values, fully typed.
- `useGridLayout()` — column count and item width for `FlatList` / `FlashList`, using the same rules as `ResponsiveGrid`.
- `useContainerWidth()` — measure the width a view actually receives (the hook behind `ResponsiveGrid` and `ResponsiveRow`).
- `useResponsive()` / `useLayout()`: `tier`, `isAtLeast(tier)`, `isBelow(tier)`, plus `formFactor` (`"phone" | "tablet"`) and `shortestSide`, so a phone in landscape can be told apart from a tablet.
- `useLayout()`: `containerMaxWidth`, `sizes`, `text`, `iconSizes`.
- Hooks `useResponsiveSizes()` and `useTextVariants()`, and the `fluid()` token helper.
- `ResponsiveRow` props `stackBelow` (custom stacking width) and `stackAtFontScale` (stack for large accessibility text).
- `ResponsiveDebugOverlay` shows the tier, plus form factor and font scale when expanded.
- Pure helpers `getTier`, `resolveResponsive`, `resolveBreakpoints`, `normalizeConfig`, `resolveTokens`, `resolveStyles`, `computeWindowClass`, `computeGridLayout`, `computeGridPlaceholderCount` and `isDeepEqual`.
- ES module build (`dist/esm`, via the `module` field) next to CommonJS (`dist/cjs`).
- MIGRATION.md, and an Expo example app (`example/`) showing every feature, including a screen written only with 1.x APIs.
- `repository`, `homepage` and `bugs` links in `package.json`, and a CI workflow (typecheck, tests, build).

### Fixed

- `ResponsiveGrid` cells now fill the row exactly. Previously each cell was floored and shrunk by 0.5px, leaving up to ~1.5px per cell of empty space on the right. Cell widths now come from flexbox, with no pixel math.
- `ResponsiveGrid` with explicit `columns` is correct on the first frame. Previously the first render used the window width and wrapped into fewer columns inside padded containers, then jumped after measuring.
- `ResponsiveGrid` with `stretchLastRow`: cells on the last row now share it equally, instead of sizing to their content.
- Default typography: `2xl` and `3xl` no longer get smaller from small phones to phones.

### Performance

- `useLayout()` subscribes to window dimensions once instead of ~19 times (once per token).
- `useResponsive()` returns a memoized object, so `useMemo`s that depend on it actually cache.
- Token group hooks recompute only when the tier changes (or on width changes, for groups with fluid tokens), and keep the same object identity within a tier.
- `ResponsiveProvider` with an inline `config={{...}}` no longer re-renders every consumer on each parent render.

### Changed

- Every value now lives in exactly one token group (1.x had `spacing.card` and `layout.cardPadding`, `spacing.gap` and `layout.gap`, etc., with different defaults). `ResponsiveContainer` uses `spacing.screen` and `layout.containerMaxWidth`; `ResponsiveRow` uses `spacing.gap`.
- Defaults: `compact` uses 1.x's phone values. `spacing.gap` is 24 from `expanded` (was 20 in `spacing`, 24 in `layout`); `spacing.card` is 16 on compact (was 12 on small phones).
- `ResponsiveGrid` per-tier `columns` and `itemHeight` follow the screen's tier, like every other responsive value, instead of the grid's measured width. This only differs when a padded container straddles a breakpoint.
- `ResponsiveGrid` renders invisible spacer views (row breaks and short-last-row placeholders) alongside its cells. Vertical spacing comes from the row breaks, so the grid container's own `rowGap` is now 0.
- Peer dependencies declare real minimums: `react >= 17`, `react-native >= 0.71` (required for `gap` / `rowGap` / `columnGap`).
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
