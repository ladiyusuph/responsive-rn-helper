# Example app

An Expo app that shows every feature of `@ladiyusuph/responsive-rn`, running against the library's source in `../src`. Edits to the library show up with fast refresh, no build step needed.

## Run it

```bash
cd example
npm install
npm start        # then press i (iOS), a (Android) or w (web)
```

Resize the browser window, rotate the simulator, or use iPad split view to watch the layout adapt. The debug overlay (top right) shows the current tier.

## What's inside

| Screen       | Shows                                                                                 |
| ------------ | ------------------------------------------------------------------------------------- |
| Showcase     | Tiers and form factor, `createStyles`, every token group, `ResponsiveRow`, both `ResponsiveGrid` modes, Show/Hide, fluid values |
| Long list    | `useGridLayout` + `useContainerWidth` driving a 120-item `FlatList`                   |
| 1.x compat   | A screen written only with deprecated 1.x APIs. It renders as in 1.x, and the console shows one deprecation warning per API |

Navigation adapts too: bottom tabs below the `expanded` tier, a side rail from `expanded` up.

- [src/theme.ts](src/theme.ts): the app's config, with custom tokens registered for type safety.
- [metro.config.js](metro.config.js): how the example resolves the library from source while using a single copy of React.

## Typecheck

```bash
npm run typecheck
```
