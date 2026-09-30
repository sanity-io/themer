---
'@sanity/themer-legacy': minor
---

**Breaking:** remove the `@sanity/themer-legacy/tool` export and its `themerTool` Studio plugin, so the package is just the theme generator. `react`, `sanity` and `styled-components` are no longer peer dependencies, and `@sanity/ui` moves from the dependencies to the peer dependencies, at `^2 || ^3 || ^4`: themes are built with the Studio's own `@sanity/ui`, and each of those majors generates the same colors as the hosted service.

To migrate, remove `themerTool()` from your Studio's `plugins`. Edit your hues on [themer.sanity.build](https://themer.sanity.build) and pass the URL it gives you to `buildThemeFromUrl`, or use `themerTool` from [`@sanity/themer/tool`](https://www.npmjs.com/package/@sanity/themer), which edits the current `buildTheme` themes.
