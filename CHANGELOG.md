# Changelog

All notable changes to this project are documented here. This project follows [Semantic Versioning](https://semver.org/).

## [Unreleased] — 1.1.0

### Added

- `useGridLayout()` — column count and item width for `FlatList` / `FlashList`, using the same rules as `ResponsiveGrid`.
- `useContainerWidth()` — measure the width a view actually receives (the hook behind `ResponsiveGrid` and `ResponsiveRow`).
- `formFactor` (`"phone" | "tablet"`) and `shortestSide` on `useResponsive()` / `computeBreakpointFlags()`, so a phone in landscape can be told apart from a tablet.
- Pure helpers `computeGridLayout`, `computeSpacingTokens`, `computeTypographyTokens`, `computeRadiiTokens`, `computeIconSizeTokens` and `isDeepEqual`.
- `repository`, `homepage` and `bugs` links in `package.json`.
- CI workflow (typecheck, tests, build).

### Fixed

- `ResponsiveGrid` cells now fill the row exactly. Previously each cell was floored and shrunk by 0.5px, leaving up to ~1.5px per cell of empty space on the right.
- `ResponsiveGrid` with `stretchLastRow`: cells on the last row now share it equally, instead of sizing to their content.
- `ResponsiveGrid` with `aspectRatio` keeps working with the new cell sizing.
- Default typography: `2xl` and `3xl` were larger on small phones than on phones (24/28 vs 22/26). Small phones now use 22/26.
- README and source comments said the default `smallPhone` breakpoint was 360; it is 320.

### Performance

- `useLayout()` now subscribes to window dimensions once instead of ~19 times (once per token).
- `useResponsive()` returns a memoized object, so `useMemo`s that depend on it actually cache.
- Token hooks (`useResponsiveSpacing`, `useResponsiveTypography`, `useResponsiveRadii`, `useResponsiveIconSizes`) recompute only when the breakpoint tier changes, and keep the same object identity within a tier.
- `ResponsiveProvider` with an inline `config={{...}}` no longer re-renders every consumer on each parent render.

### Changed

- Peer dependencies now declare real minimums: `react >= 17`, `react-native >= 0.71` (required for `gap` / `rowGap` / `columnGap`).
