# Themer

> ⚠️ This is a very experimental project 🚨

https://user-images.githubusercontent.com/81981/180262026-6b2c8243-8c47-4cac-84dd-c031df929002.mov

## Importing your theme from `themer.sanity.build` is deprecated

Themer used to hand you an ESM URL to import straight into your Studio config:

```ts
import {theme} from 'https://themer.sanity.build/api/hues?preset=verdant'
```

That endpoint keeps serving themes so existing Studios don't break, but it now logs a migration notice to the console on every load. The same colors are generated locally by [`@sanity/themer-legacy`](https://www.npmjs.com/package/@sanity/themer-legacy), with no network request and with TypeScript typings included:

```sh
npm install @sanity/themer-legacy
```

```ts
import {buildThemeFromUrl} from '@sanity/themer-legacy'

const theme = buildThemeFromUrl('https://themer.sanity.build/api/hues?preset=verdant')
```

The URL is only a carrier for the hues, `buildThemeFromUrl` never fetches it. Keep using [themer.sanity.build](https://themer.sanity.build) to preview and tweak your theme, then paste the URL it gives you into `buildThemeFromUrl`.

The full guide lives in the [`@sanity/themer-legacy` README](packages/themer-legacy/README.md#migrating-from-themersanitybuild). It covers the `createTheme` + `hues` variant (now `createTheme` + `parseHuesFromUrl`), preset-only URLs like `'?preset=verdant'`, and the one intentional difference from the hosted module (the `__themer` font flag).

If you already migrated to `@sanity/themer/legacy`, that subpath keeps working as a deprecated re-export of `@sanity/themer-legacy` until `@sanity/themer@1.0` removes it. Swap the import to finish the move:

```diff
-import { buildThemeFromUrl } from '@sanity/themer/legacy'
+import { buildThemeFromUrl } from '@sanity/themer-legacy'
```

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

## Repository

pnpm workspace for the hosted Themer ([themer.sanity.build](https://themer.sanity.build)) and [`@sanity/themer-legacy`](packages/themer-legacy), the package that replicates it.

| Package                                           | Description                                                                                 |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [`@sanity/themer-legacy`](packages/themer-legacy) | The hosted Themer's theme generator as an npm package, and a Studio tool to edit its themes |

| App                                | Description                                                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [`apps/v1`](apps/v1)               | [themer.sanity.build](https://themer.sanity.build) (Next.js), including the deprecated `/api/hues` endpoint |
| [`apps/storybook`](apps/storybook) | Storybook for `@sanity/themer-legacy` ([localhost:6006](http://localhost:6006) via `pnpm dev`)              |

### Requirements

- Node.js `>=22.13`
- [pnpm](https://pnpm.io) `12` (pinned via `packageManager` in `package.json`)

### Getting started

```sh
pnpm install
pnpm build
pnpm test
```

```sh
pnpm dev      # Storybook at http://localhost:6006
pnpm dev:v1   # themer.sanity.build at http://localhost:3001
```

Storybook resolves `@sanity/themer-legacy` to its TypeScript source through the package `exports`, so it hot-reloads package edits without a rebuild.

### Common scripts

| Script              | What it does                                       |
| ------------------- | -------------------------------------------------- |
| `pnpm build`        | Build `@sanity/themer-legacy`                      |
| `pnpm test`         | Unit tests (`@sanity/themer-legacy` and `apps/v1`) |
| `pnpm test:browser` | Storybook browser tests (Chromium via Playwright)  |
| `pnpm lint`         | Lint + type-check (oxlint)                         |
| `pnpm format`       | Format with oxfmt                                  |
| `pnpm knip`         | Unused files / dependencies / exports              |
| `pnpm changeset`    | Add a changeset for a release                      |

## Contributing & releasing

See [CONTRIBUTING.md](CONTRIBUTING.md). Releases use [Changesets](https://github.com/changesets/changesets): add a changeset on your PR; merging to `main` opens a “Version Packages” PR that publishes to npm when merged.

## License

MIT — see [LICENSE](LICENSE).
