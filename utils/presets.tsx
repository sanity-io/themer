// Handy list over all the preset themes
// @TODO use TS template string types to enforce lower casing on slugs

import type { ThemePreset } from 'utils/types'

const createApiUrl = (search: string) => {
  const searchParams = new URLSearchParams(search)
  if (process.env.NODE_ENV === 'production') {
    searchParams.set('min', '1')
  }
  return `/api/hues?${decodeURIComponent(searchParams.toString())}`
}

export const defaultPreset: ThemePreset = {
  slug: 'default',
  title: 'Studio v3',
  url: createApiUrl(
    '?lightest=fff&darkest=101112&default=8690a0;500&primary=2276fc;500&transparent=8690a0;500&positive=43d675;400&caution=fbd024;300&critical=f03e2f;500'
  ),
}

const pinkSynth: ThemePreset = {
  slug: 'pink-synth',
  title: 'Pink Synth',
  url: createApiUrl(
    '?lightest=f7f2f5&darkest=171721&default=8b6584&primary=ec4899&transparent=503a4c&positive=10b981&caution=fde047;300&critical=fe3459'
  ),
}

const twCyan: ThemePreset = {
  slug: 'tw-cyan',
  title: 'Tailwind Cyan',
  url: createApiUrl(
    '?default=677389;500;lightest:f9fafb;darkest:101728&primary=51b4d0;500;lightest:effefe;darkest:264d61&transparent=6b727f;500;lightest:f8fafb;darkest:131826&positive=55b785;500;lightest:eefdf5;darkest:214d3b&caution=e2b53e;500;lightest:fefbea;darkest:69411b&critical=e14f62;500;lightest:fdf2f2;darkest:7d2037'
  ),
}

const verdant: ThemePreset = {
  slug: 'verdant',
  title: 'Verdant',
  url: createApiUrl(
    '?default=5c9199;500;lightest:fcfdfd;darkest:0d1415&primary=1cb485;400;lightest:fcfdfd;darkest:0d1415&transparent=5c9199;500;lightest:fcfdfd;darkest:0d1415&positive=43D675;300;lightest:fcfdfd;darkest:0d1415&caution=FBD024;200;lightest:fcfdfd;darkest:0d1415&critical=F03E2F;500;lightest:fcfdfd;darkest:0d1415'
  ),
  // https://cdn.sanity.io/images/32a3sayd/blog/22b33a9a6a7c1a964648e1e9ce1324791c7456dc-800x1000.png
}

const rosabel: ThemePreset = {
  slug: 'rosabel',
  title: 'Rosabel',
  url: createApiUrl(
    '?default=9d8966&primary=ed2555;700&transparent=9d8966&positive=43d675;300&caution=fbd024;200&lightest=fdfdfc&darkest=15120d'
  ),
  // https://cdn.sanity.io/images/32a3sayd/blog/c7df4bf5a0b43b3996aad56b6cecbfbc3579cb53-800x1198.png
}

const dugg: ThemePreset = {
  slug: 'dew',
  title: 'Dew',
  url: createApiUrl(
    '?default=5e63b4;600;lightest:fcfcfd;darkest:0d0d15&primary=d1a308;400;lightest:fcfcfd;darkest:0d0d15&transparent=6c6fa7;500;lightest:fcfcfd;darkest:0d0d15&positive=43D675;300;lightest:fcfcfd;darkest:0d0d15&caution=fb9f24;400;lightest:fcfcfd;darkest:0d0d15&critical=F03E2F;500;lightest:fcfcfd;darkest:0d0d15'
  ),
  // https://cdn.sanity.io/images/32a3sayd/blog/994c6a38c71357af600e7d4856d5fd1340338f6c-2148x1611.png
}

export const presets: ThemePreset[] = [
  defaultPreset,
  dugg,
  pinkSynth,
  rosabel,
  twCyan,
  verdant,
]

export function getPreset(slug: string): ThemePreset {
  const needle = slug?.toLowerCase()
  const match = presets.find((preset) => preset.slug === needle)
  if (match) return match
  return defaultPreset
}
