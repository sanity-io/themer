# AGENTS.md

## Cursor Cloud specific instructions

This is the Sanity Themer repository, structured as a pnpm monorepo set up like
sanity-io/ui: the published `@sanity/themer-legacy` package (the hosted
themer.sanity.build `/api/hues` generator replicated byte-for-byte, plus a
`/tool` subpath with the `themerTool` Studio plugin, moved here from the
sanity-io/ui monorepo) lives in `packages/themer-legacy`, its Storybook in
`apps/storybook`, and the hosted Themer itself (themer.sanity.build, a Next.js
14 pages-router app deployed through Vercel) in `apps/v1`
(`pnpm-workspace.yaml`). The root `package.json` is a private workspace root
whose scripts orchestrate via pnpm filters. Package manager is pnpm
(`packageManager` pin in `package.json`); developing in this repo requires Node
`>=22.13`.

Standard scripts live in the root `package.json` (`lint`, `test`, `build`,
`dev`). Notes that are not obvious from the scripts:

- Linting uses [oxlint](https://oxc.rs/docs/guide/usage/linter.html) with a
  root `.oxlintrc.json` (type-aware via `oxlint-tsgolint`), the same config as
  sanity-io/ui. TypeScript type checking is included in `pnpm lint` via the
  `typeCheck` option — there is no separate `tsc` command. `apps/v1` has an
  override that turns off the React Compiler diagnostics (it isn't built with
  the compiler) and the type-aware rules its legacy `strict: false` code
  predates; everything else applies to it as well. Run `pnpm lint:fix` to
  auto-fix issues when possible. Suppressions use `oxlint-disable-next-line`
  comments.
- `pnpm knip` runs [knip](https://knip.dev) (config in `knip.jsonc`, also a CI
  job) with `--treat-config-hints-as-errors`, so stale knip config fails too.
  Anything only used within its own module should not be exported.
- `packages/themer-legacy` is built with [tsdown](https://tsdown.dev) via
  `@sanity/tsdown-config`. Its package.json `exports` resolve to the
  TypeScript source for every tool in the workspace; the publishable dist
  `exports` live under `publishConfig`. tsdown loads `tsdown.config.mts`
  through Node's native TypeScript support, so `pnpm build` needs Node
  `>=22.18` (CI uses the current LTS).
- Cross-repo dependencies (`@sanity/ui`, `@sanity/color`, `@sanity/icons`) come
  from npm through the pnpm catalog. `@sanity/ui` stays on a v4 range, so the
  generated themes stay byte-identical to the hosted ones.
- `@sanity/ui` from npm doesn't import its own CSS, so
  `apps/storybook/.storybook/preview.tsx` imports `@sanity/ui/styles.css`.
- `pnpm test` runs the unit tests with vitest: `packages/themer-legacy` (in
  node, against source — the `legacy.test.ts` fixtures pin the output of the
  hosted service) and `apps/v1` (its `utils`, in the `edge-runtime`
  environment its `/api/*` routes run in).
- `pnpm test:browser` runs the Storybook tests (`apps/storybook`): vitest
  renders every story in headless Chromium via `@storybook/addon-vitest` and
  executes story `play` interactions, plus the browser tests in
  `apps/storybook/tests/`. Install the browser once via
  `pnpm --filter sanity-themer-storybook exec playwright install chromium`.
  The `tool/` stories import the plugin's internal components from
  `packages/themer-legacy/src/tool` by relative path.
- `apps/v1` is frozen on `@sanity/ui` 2, React 18 and Next.js 14: its
  `/api/hues` endpoint bundles the `@sanity/ui` 2 source it pins
  (`scripts/buildEdgeUtils.mjs`, run by `prebuild`/`predev`), and those themes
  are what `@sanity/themer-legacy` replicates. Don't upgrade its `@sanity/ui`
  or `@sanity/color` (Renovate skips them). The rest of the workspace is on
  React 19, so unlike sanity-io/ui there are no workspace-wide `react`
  overrides, and dependency typings without their own `@types/react` resolve
  the hoisted React 19 one — in `apps/v1`, avoid spreading props typed with its
  React 18 types onto intrinsic elements, which fails `next build`'s type
  check. `next build` in `apps/v1` isn't part of CI; Vercel builds it.
- `pnpm dev:v1` starts the hosted Themer on http://localhost:3001; its Studio
  previews need the Vercel project's `NEXT_PUBLIC_SANITY_*` environment
  variables in `apps/v1/.env.local`.
- Releases are managed with Changesets (`.changeset/config.json` matches
  sanity-io/ui's): run `pnpm changeset` to add a changeset to a PR that should
  trigger a release. Merging to `main` opens/updates a "Version Packages" PR,
  and merging that publishes to npm from `.github/workflows/release.yml`
  (npm trusted publishing, OIDC) under the `latest` dist-tag.
