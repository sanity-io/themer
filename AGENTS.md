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
- `pnpm format` formats the repository with
  [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) and the root
  `.oxfmtrc.json`, the same config as sanity-io/ui. It skips the lockfile,
  changelogs and build output, and it doesn't format the `.txt` bundles in
  `apps/v1/frozen/` or the `.golden` files, since it doesn't handle those
  extensions. `format-if-needed.yml` opens a formatting PR when `main` needs
  one.
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
  executes story `play` interactions. Install the browser once via
  `pnpm --filter sanity-themer-storybook exec playwright install chromium`.
- `apps/v1` is frozen on `@sanity/ui` 2, React 18 and Next.js 14, which its UI
  and the Sanity Studio v3 previews it embeds are built on (the themes it
  previews come from `@sanity/themer-legacy`). Don't upgrade its `@sanity/ui` or
  `@sanity/color` (Renovate skips them). `/api/hues` serves the esbuild bundles
  frozen in `apps/v1/frozen/` (wrapped by `scripts/buildEdgeUtils.mjs`, run by
  `prebuild`/`predev`), byte for byte what production has always served. Never
  edit or regenerate them: bundling them from `node_modules` again changes
  their bytes whenever the resolved versions or the pnpm layout change, down to
  the paths the `?min=0` build prints as comments. The rest of the workspace is on
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

## `/api/hues` contract

Production Studios still import their theme from
`https://themer.sanity.build/api/hues?…` (`import {theme} from '…'`, or
`createTheme` and `hues` to tweak it in code). The endpoint is deprecated, but
anything it serves differently can crash those Studios, so its responses must
stay byte-identical to what production serves today. The contract tests in
`apps/v1/contract/` check that:

- `pnpm --filter v1 test:contract` runs `api-hues.contract.mjs` with the
  Node.js test runner (no dependencies needed), sending only GET requests to
  `API_HUES_BASE_URL` (https://themer.sanity.build by default, set it to a
  preview URL to test that). For every case in `api-hues.mjs` (all presets,
  custom hues, edge cases, and invalid input, which responds 200 with a module
  that throws a `TypeError`) it checks the status, the `content-type`, CORS
  and `cache-control` headers, that the module imports and exports what
  Studios use, in Node and in browser-like global scopes where the deprecation
  notice takes each of its branches (`evaluate.mjs`), and that the body
  matches `goldens/<case>.golden` byte for byte. Only the requested origin
  (replaced with https://themer.sanity.build) and the
  `// Generated <timestamp>` line are normalized. `goldens/hosted-themes.json`
  also pins the colors three URLs resolved to on 2026-07-24.
- Goldens are captured from production. Never regenerate one to make a check
  pass, since that changes what production Studios receive. To add a case, add
  it to `api-hues.mjs` and run `pnpm --filter v1 capture:goldens`, which only
  captures missing goldens.
- Everything that ends up in the served module is part of the contract: the
  esbuild bundles frozen in `apps/v1/frozen/`, the hues `pages/api/hues.ts`
  computes with `utils/` and writes into them with `json5`, and its
  deprecation notice. The bundles are frozen because bundling them from
  `node_modules` moves their bytes whenever the resolved versions or the pnpm
  layout change, so never edit or regenerate them.
- The `/api/hues contract` workflow
  (`.github/workflows/api-hues-contract.yml`) runs the tests on pull requests
  against the Vercel preview of the head commit, on pushes to `main` against
  https://themer.sanity.build once it serves that commit's production
  deployment, hourly against production, and on demand with an optional
  deployment URL. `wait-for-deployment.mjs` finds the deployment through the
  GitHub deployments and commit statuses that Vercel's GitHub integration
  creates, and fails when Vercel reports a failed deployment or none succeeds
  within 20 minutes (Vercel only deploys pull requests from forks once a
  member of the Vercel team authorizes it).
- Vercel previews aren't protected. If Deployment Protection gets turned on,
  add its Protection Bypass for Automation secret as the
  `VERCEL_AUTOMATION_BYPASS_SECRET` repository secret; the tests already send
  it as the `x-vercel-protection-bypass` header.
