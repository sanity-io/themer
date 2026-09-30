// Contract tests for `/api/hues`, the deprecated endpoint that production
// Studios still import their theme from, so anything it serves differently can
// crash them. Every response has to match what production serves today, byte
// for byte. The tests only send GET requests, to API_HUES_BASE_URL
// (https://themer.sanity.build by default).
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { Worker } from 'node:worker_threads'

import {
  cases,
  decode,
  goldenUrl,
  normalize,
  PRODUCTION_URL,
  request,
} from './api-hues.mjs'

const baseUrl = (process.env.API_HUES_BASE_URL || PRODUCTION_URL).replace(
  /\/+$/,
  '',
)
const { origin } = new URL(baseUrl)

// Browsers only evaluate a cross-origin module import that has a JavaScript
// MIME type and CORS headers, and Studios revalidate the theme on every load
const HEADERS = {
  'access-control-allow-origin': '*',
  'cache-control': 'public, max-age=0, must-revalidate',
  'content-type': 'application/javascript; charset=utf-8',
}

const HUES = [
  'default',
  'primary',
  'transparent',
  'positive',
  'caution',
  'critical',
]
const MIDPOINTS = new Set([
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
])

/**
 * The deprecation notice at the top of every theme module takes a different
 * branch in each of these (set up in `evaluate.mjs`), and none of them may
 * throw: server-side and build-time imports have no `window`, a static import
 * in the browser runs while the document is still loading, and a dynamic
 * import can run after it has loaded, in a browser without `reportError`.
 */
const environments = [
  { name: 'server', logged: 2, reported: 0, listeners: [] },
  {
    name: 'browser, loading',
    logged: 1,
    reported: 1,
    listeners: [{ type: 'load', options: { once: true } }],
  },
  { name: 'browser, loaded', logged: 2, reported: 0, listeners: [] },
]

function evaluate(bytes, environment) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('evaluate.mjs', import.meta.url), {
      workerData: { bytes, environment },
    })
    worker.once('message', (result) => {
      resolve(result)
      worker.terminate()
    })
    worker.once('error', reject)
    worker.once('exit', (code) =>
      reject(new Error(`The ${environment} import exited with ${code}`)),
    )
  })
}

function assertIdentical(served, golden) {
  if (served === golden) return
  let index = 0
  while (served[index] === golden[index]) index++
  const excerpt = (text) =>
    JSON.stringify(text.slice(Math.max(0, index - 100), index + 100))
  assert.fail(
    `Differs from its golden at character ${index} (${served.length} served, ${golden.length} in the golden)\n` +
      `served: ${excerpt(served)}\ngolden: ${excerpt(golden)}`,
  )
}

function assertHues(hues) {
  assert.deepEqual(Object.keys(hues), HUES)
  for (const name of HUES) {
    const hue = hues[name]
    assert.deepEqual(
      Object.keys(hue).sort(),
      ['darkest', 'lightest', 'mid', 'midPoint'],
      name,
    )
    for (const key of ['lightest', 'darkest', 'mid']) {
      assert.match(hue[key], /^#(?:[0-9a-f]{3}){1,2}$/, `${name}.${key}`)
    }
    assert.ok(MIDPOINTS.has(hue.midPoint), `${name}.midPoint`)
  }
}

function assertStudioImports(result, { name }) {
  assert.equal(result.importError, undefined, `${name}: the import throws`)
  assert.deepEqual(
    result.exports,
    { createTheme: 'function', hues: 'object', theme: 'object' },
    `${name}: exports`,
  )
  assertHues(result.hues)
  // Studio reads `color`, `fonts` and `v2` off a custom theme, and swaps in
  // its own fonts for themes flagged `__themer`
  const { theme } = result
  assert.equal(theme.__themer, true)
  assert.equal(typeof theme.color.light, 'object')
  assert.equal(typeof theme.color.dark, 'object')
  assert.equal(typeof theme.fonts, 'object')
  assert.equal(theme.v2, undefined)
  assert.equal(
    result.createThemeError,
    undefined,
    `${name}: createTheme throws`,
  )
  assert.ok(
    JSON.stringify(result.recreated) === JSON.stringify(theme),
    'createTheme(hues) recreates theme',
  )
  assert.deepEqual(Object.keys(result.tweaked), Object.keys(theme))
}

function assertNotice(result, environment) {
  const { name } = environment
  assert.equal(result.logged.length, environment.logged, `${name}: logged`)
  assert.equal(
    result.reported.length,
    environment.reported,
    `${name}: reported`,
  )
  assert.deepEqual(
    result.listeners,
    environment.listeners,
    `${name}: listeners`,
  )
  const [notice] = result.logged[0]
  assert.match(notice, /is deprecated\.\nInstall @sanity\/themer-legacy/)
  for (const args of result.logged) assert.deepEqual(args, [notice], name)
  for (const error of result.reported) {
    assert.deepEqual(error, { constructor: 'Error', message: notice }, name)
  }
}

function describeResponse(response) {
  if (response.status === 401 || response.status === 403) {
    return `${response.url} responded ${response.status}, set VERCEL_AUTOMATION_BYPASS_SECRET if Vercel Deployment Protection is on`
  }
  return `${response.url} responded ${response.status}`
}

const responses = new Map(
  await Promise.all(
    cases.map(async ({ name, query }) => [
      name,
      await request(baseUrl, query).catch((error) => error),
    ]),
  ),
)

function responseFor(name) {
  const response = responses.get(name)
  if (response instanceof Error) throw response
  return response
}

test('every case has a golden, and every golden a case', async () => {
  const names = cases.map(({ name }) => name)
  assert.equal(new Set(names).size, names.length, 'case names are unique')
  const goldens = (await readdir(new URL('goldens/', import.meta.url)))
    .filter((file) => file.endsWith('.golden'))
    .map((file) => file.slice(0, -'.golden'.length))
  assert.deepEqual(goldens.sort(), names.sort())
})

for (const testCase of cases) {
  const name = `${testCase.name}: GET /api/hues${testCase.query}`
  test(name, { timeout: 60_000 }, async (t) => {
    const response = responseFor(testCase.name)

    await t.test('responds 200 with the headers Studios rely on', () => {
      assert.equal(response.status, 200, describeResponse(response))
      for (const [header, value] of Object.entries(HEADERS)) {
        assert.equal(response.headers.get(header), value, header)
      }
    })

    await t.test(
      testCase.error
        ? 'throws a TypeError when imported'
        : 'exports what Studios import',
      async () => {
        const results = await Promise.all(
          environments.map(({ name }) => evaluate(response.bytes, name)),
        )
        for (const [index, environment] of environments.entries()) {
          const result = results[index]
          if (testCase.error) {
            assert.deepEqual(
              result.importError,
              { constructor: 'TypeError', message: testCase.error },
              environment.name,
            )
            assert.deepEqual(result.logged, [], environment.name)
          } else {
            assertStudioImports(result, environment)
            assertNotice(result, environment)
          }
        }
      },
    )

    await t.test('is byte-identical to production', async () => {
      const golden = decode(await readFile(goldenUrl(testCase.name)))
      assertIdentical(normalize(decode(response.bytes), origin), golden)
    })
  })
}

const { fixtures } = JSON.parse(
  await readFile(
    new URL('goldens/hosted-themes.json', import.meta.url),
    'utf8',
  ),
)
for (const fixture of fixtures) {
  const name = `resolves the theme captured on 2026-07-24: ${fixture.url}`
  test(name, { timeout: 60_000 }, async () => {
    const testCase = cases.find(
      ({ query }) => `${PRODUCTION_URL}/api/hues${query}` === fixture.url,
    )
    assert.ok(testCase, `no case requests ${fixture.url}`)
    const { hues, theme } = await evaluate(
      responseFor(testCase.name).bytes,
      'server',
    )

    assert.deepEqual(hues, fixture.hues)
    assert.equal(
      createHash('sha256')
        .update(JSON.stringify(canonicalize(theme.color)))
        .digest('hex'),
      fixture.colorSha256,
    )
    for (const [path, expected] of Object.entries(fixture.samples)) {
      const value = path
        .split('.')
        .reduce((node, key) => node[key], theme.color)
      assert.equal(value, expected, path)
    }
  })
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])]),
    )
  }
  return value
}
