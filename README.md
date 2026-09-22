# Themer

> ⚠️ This is a very experimental project 🚨

https://user-images.githubusercontent.com/81981/180262026-6b2c8243-8c47-4cac-84dd-c031df929002.mov

## Importing your theme from `themer.sanity.build` is deprecated

Themer used to hand you an ESM URL to import straight into your Studio config:

```ts
import { theme } from 'https://themer.sanity.build/api/hues?preset=verdant'
```

That endpoint keeps serving themes so existing Studios don't break, but it now logs a migration notice to the console on every load. The same colors are generated locally by [`@sanity/themer`](https://www.npmjs.com/package/@sanity/themer), with no network request and with TypeScript typings included:

```sh
npm install @sanity/themer
```

```ts
import { buildThemeFromUrl } from '@sanity/themer/legacy'

const theme = buildThemeFromUrl(
  'https://themer.sanity.build/api/hues?preset=verdant',
)
```

The URL is only a carrier for the hues, `buildThemeFromUrl` never fetches it. Keep using [themer.sanity.build](https://themer.sanity.build) to preview and tweak your theme, then paste the URL it gives you into `buildThemeFromUrl`.

The full guide lives in the [`@sanity/themer` README](https://github.com/sanity-io/ui/blob/main/packages/themer/README.md#migrating-from-themersanitybuild). It covers the `createTheme` + `hues` variant (now `createTheme` + `parseHuesFromUrl`), preset-only URLs like `'?preset=verdant'`, and the one intentional difference from the hosted module (the `__themer` font flag).

## Check your Studio for leftovers

Once migrated, nothing in your Studio should reference the hosted endpoint anymore. Run this at the root of your Studio repo:

```sh
rg 'themer\.sanity\.build' .
```

If it still matches, delete whatever it finds. The setup snippets Themer used to generate left these behind:

- The static `import {theme} from 'https://themer.sanity.build/api/hues?...'` in `sanity.config.ts`, replaced by `buildThemeFromUrl` above.
- The dynamic `await import(/* webpackIgnore: true */ 'https://themer.sanity.build/api/hues?...')`, including the `useEffect` in `pages/index.tsx` that swapped the theme in at runtime. Pass the theme to `defineConfig` directly instead.
- `themer.d.ts` with its `declare module 'https://themer.sanity.build/api/hues?...'`. The theme is typed by the package now, so any `// @ts-expect-error` above the old import goes too.
- `experimental.urlImports` in `next.config.js`.
- The custom `_document.tsx` / `_document.js` that only existed to add `<link rel="modulepreload" href="https://themer.sanity.build/api/hues?...">`.
- A downloaded `theme.js` next to `sanity.config.ts`.
