# Contributing guidelines

This repository is a pnpm monorepo. The published `@sanity/themer-legacy` package lives in
[`packages/themer-legacy`](packages/themer-legacy), its Storybook lives in
[`apps/storybook`](apps/storybook), and the hosted Themer at
[themer.sanity.build](https://themer.sanity.build) lives in [`apps/v1`](apps/v1).

## Getting started

```sh
pnpm install
pnpm build
pnpm test
```

Run `pnpm dev` to start Storybook (http://localhost:6006). Storybook resolves
`@sanity/themer-legacy` from the package source, so edits to `packages/themer-legacy/src`
hot-reload without a rebuild.

Run `pnpm dev:v1` to start the hosted Themer (http://localhost:3001). Its embedded Studio
previews read their Sanity project and datasets from the `NEXT_PUBLIC_SANITY_*` environment
variables of the Vercel project, in `apps/v1/.env.local`.

## Testing

Unit tests are written with [vitest](https://vitest.dev) and live next to the source in
`packages/themer-legacy/src` and `apps/v1/utils/__tests__`. Run them with `pnpm test` (or
`pnpm test:watch` in `packages/themer-legacy` for watch mode). They run against the source, so
no build is required.

Browser tests live in the Storybook app (`apps/storybook`) and use
[Storybook's Vitest addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon):
every story is rendered as a smoke test in headless Chromium, and interaction tests are written
as story [`play` functions](https://storybook.js.org/docs/writing-stories/play-function).

Install the Playwright-provided browser once with
`pnpm --filter sanity-themer-storybook exec playwright install chromium`, then run
`pnpm test:browser`. While developing, `pnpm dev` exposes the same tests interactively through
the testing panel in the Storybook UI.

## The hosted Themer

`apps/v1` keeps serving `https://themer.sanity.build/api/hues` for the Studios that still import
their theme from it, and `@sanity/themer-legacy` promises to generate the exact same themes. The
endpoint bundles the source of the `@sanity/ui` 2 that the app pins, so the app stays on its
`@sanity/ui` 2, React 18 and Next.js 14 stack: don't upgrade its `@sanity/ui` or `@sanity/color`
(Renovate skips them), and check that `packages/themer-legacy/src/generator/__fixtures__/hosted.ts`
still matches what the endpoint serves when you change how it generates themes.

## Releasing

Releases are managed with [Changesets](https://github.com/changesets/changesets).

When you make a change that should be released, add a changeset to your pull request:

```sh
pnpm changeset
```

Once pull requests with changesets are merged into `main`, a "Version Packages" pull request is
opened (and kept up to date) that bumps the affected package versions and updates their
changelogs. Merging that pull request publishes the packages to npm through the
[`Release` workflow](https://github.com/sanity-io/themer/actions/workflows/release.yml), which
uses npm [Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC). Releases are
published under the `latest` dist-tag.
