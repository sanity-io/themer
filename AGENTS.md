# AGENTS.md

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
  `@sanity/ui@2.1.1` source it bundles, the `@sanity/color` and
  `@babel/runtime` versions that resolves, `esbuild`, `json5`, and the
  `node_modules/.pnpm` paths that the `?min=0` build prints as comments.
  Dependency, lockfile or package manager changes that move any of them fail
  the contract.
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
