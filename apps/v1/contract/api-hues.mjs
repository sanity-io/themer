// Shared by the `/api/hues` contract tests and the script that captures their goldens.
import {setTimeout as delay} from 'node:timers/promises'

export const PRODUCTION_URL = 'https://themer.sanity.build'

const PRESETS = [
  'default',
  'dew',
  'pink-synth',
  'pixel-art',
  'retro-colonial',
  'rosabel',
  'stereofidelic',
  'tw-cyan',
  'verdant',
]

/**
 * Every query string the contract covers, named after its golden in `goldens/`.
 * Cases with an `error` pin how invalid input behaves today: a 200 response
 * whose module throws a `TypeError` with that message when it's imported.
 */
export const cases = [
  {name: 'bare', query: ''},
  ...PRESETS.map((slug) => ({
    name: `preset-${slug}`,
    query: `?preset=${slug}`,
  })),

  // Only `min=0` serves the unminified build
  {name: 'unminified', query: '?preset=verdant&min=0'},
  {name: 'min-not-zero', query: '?preset=verdant&min=false'},

  {name: 'custom-primary', query: '?primary=22fca8'},
  {name: 'custom-short-hex', query: '?primary=0af'},
  {name: 'custom-uppercase-hex', query: '?primary=22FCA8'},
  {name: 'custom-preset-primary', query: '?preset=verdant&primary=22fca8'},
  {
    name: 'custom-preset-midpoint',
    query: '?preset=pink-synth&primary=b595f9;400',
  },
  {
    // The default preset, spelled out
    name: 'custom-all-hues',
    query:
      '?lightest=fff&darkest=101112&default=8690a0;500&primary=2276fc;500&transparent=8690a0;500&positive=43d675;400&caution=fbd024;300&critical=f03e2f;500',
  },
  {
    name: 'custom-hue-extremes',
    query: '?primary=2276fc;600;lightest:fcfcfd;darkest:0d0d15',
  },
  {name: 'custom-mid-without-midpoint', query: '?caution=ff0000'},

  {name: 'edge-unknown-preset', query: '?preset=does-not-exist'},
  {name: 'edge-preset-case', query: '?preset=VERDANT'},
  {name: 'edge-unknown-param', query: '?foo=bar'},
  {name: 'edge-repeated-param', query: '?primary=22fca8&primary=ff0000'},
  {name: 'edge-encoded-separator', query: '?primary=b595f9%3B400'},
  {name: 'edge-empty-param', query: '?primary='},
  // An empty `darkest` is ignored, an empty `lightest` is invalid
  {name: 'edge-empty-darkest', query: '?darkest='},
  // Parsed as the hex color #500, not as a midpoint
  {name: 'edge-numeric-color', query: '?primary=500'},
  {name: 'edge-midpoint-rounding', query: '?primary=2276fc;123'},
  {name: 'edge-midpoint-clamp', query: '?primary=2276fc;2000'},
  {name: 'edge-inverted-extremes', query: '?lightest=000&darkest=fff'},
  // The deprecation notice can't decode it and keeps it percent-encoded
  {name: 'edge-malformed-escape', query: '?foo=%E0%A4%A'},
  {name: 'edge-quotes-in-param', query: '?foo=%27%22%5C%60'},
  {name: 'edge-unicode-param', query: '?foo=%F0%9F%8E%A8'},

  {
    name: 'invalid-color',
    query: '?primary=nothex',
    error: 'Invalid param for the primary hue: nothex',
  },
  {
    name: 'invalid-lightest',
    query: '?lightest=nothex',
    error: 'Invalid color: #nothex',
  },
  {
    name: 'invalid-empty-lightest',
    query: '?lightest=',
    error: 'Invalid color: #',
  },
  {
    name: 'invalid-hue-lightest',
    query: '?primary=2276fc;lightest:nothex',
    error: 'Invalid color: #nothex',
  },
  {
    name: 'invalid-duplicate',
    query: '?primary=2276fc;2276fc',
    error:
      'Duplicate params detected. Remove at least one of the "2276fc" from the primary hue: "2276fc;2276fc"',
  },
  {
    // `600` is a hex color too, so it's reported as a second color
    name: 'invalid-duplicate-midpoint',
    query: '?primary=2276fc;500;600',
    error:
      'Duplicate params detected. Remove at least "2276fc" or "600" from the primary hue: "2276fc;500;600"',
  },
  {
    name: 'invalid-duplicate-lightest',
    query: '?primary=2276fc;lightest:fff;lightest:000',
    error:
      'Duplicate params detected. Remove at least "lightest:fff" or "lightest:000" from the primary hue: "2276fc;lightest:fff;lightest:000"',
  },
  {
    name: 'invalid-too-many-parts',
    query: '?primary=2276fc;500;lightest:fff;darkest:000;fff',
    error:
      'Invalid number of params for the primary hue, it should be 4 or less instead it\'s 5: ["2276fc","500","lightest:fff","darkest:000","fff"]',
  },
  {
    name: 'invalid-quote-escaping',
    query: '?primary=%22%3E%3C%2Fscript%3E',
    error: 'Invalid param for the primary hue: "></script>',
  },
]

const ATTEMPTS = 3

/**
 * Sends the same GET request a Studio's cross-origin `import` does. Only
 * network failures are retried: every response counts, whatever its status.
 */
export async function request(baseUrl, query, attempt = 1) {
  const url = `${baseUrl}/api/hues${query}`
  const headers = {accept: '*/*', origin: 'https://example.sanity.studio'}
  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    headers['x-vercel-protection-bypass'] = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  }

  try {
    const response = await fetch(url, {
      headers,
      redirect: 'manual',
      signal: AbortSignal.timeout(30_000),
    })
    const bytes = new Uint8Array(await response.arrayBuffer())
    return {url, status: response.status, headers: response.headers, bytes}
  } catch (error) {
    if (attempt === ATTEMPTS) {
      throw new Error(`GET ${url} failed ${ATTEMPTS} times`, {cause: error})
    }
    await delay(attempt * 2_000)
    return request(baseUrl, query, attempt + 1)
  }
}

const decoder = new TextDecoder('utf-8', {fatal: true, ignoreBOM: true})

/** Throws unless the bytes are valid UTF-8, and keeps a byte order mark. */
export function decode(bytes) {
  return decoder.decode(bytes)
}

/**
 * The deprecation notice embeds the origin it was requested from, and theme
 * modules start with the time they were generated: those are the only parts
 * of a response that may differ from its golden.
 */
export function normalize(body, origin) {
  return body
    .replaceAll(origin, PRODUCTION_URL)
    .replace(
      /^\/\/ Generated \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/m,
      '// Generated <timestamp>',
    )
}

export const goldenUrl = (name) => new URL(`goldens/${name}.golden`, import.meta.url)
