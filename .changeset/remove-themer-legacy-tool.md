---
'@sanity/themer-legacy': minor
---

**Breaking:** remove the `@sanity/themer-legacy/tool` export and its `themerTool` Studio plugin, leaving just the theme generator. `@sanity/ui` is now its only peer dependency, at `^2 || ^3 || ^4`, so themes are built with the Studio's own `@sanity/ui`, and each of those majors generates the same colors as the hosted service. `react`, `sanity` and `styled-components` are no longer peer dependencies, and the package has no dependencies of its own anymore.

To migrate, remove `themerTool()` from your Studio's `plugins`. To keep editing your hues, use [themer.sanity.build](https://themer.sanity.build) and pass the URL it gives you to `buildThemeFromUrl`, or switch to `themerTool` from [`@sanity/themer/tool`](https://www.npmjs.com/package/@sanity/themer), which edits the current `buildTheme` themes.
