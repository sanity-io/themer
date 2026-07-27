import { themeFromHuesTemplate } from 'edge-utils/themeFromHuesTemplate.mjs'
import type { NextRequest } from 'next/server'
import { applyHuesFromPreset } from 'utils/applyHuesFromPreset'
import { getPreset } from 'utils/presets'
import { ServerTiming, type ServerTimingInstance } from 'utils/ServerTiming'
import { ValidationError } from 'utils/ValidationError'

export const config = {
  runtime: 'experimental-edge',
}

// This endpoint has to keep serving themes for the Studios that already import
// it, so instead of removing it we log how to get the very same theme from npm.
const migrationNotice = (requestUrl: string) => {
  const url = new URL(requestUrl)
  // `min` only affects how this response is formatted, so it's noise in the snippet
  url.searchParams.delete('min')
  // Keep the `;` hue separators readable, the same way presets spell out their URLs,
  // but never let a malformed escape sequence take the endpoint down
  let importUrl = url.toString()
  try {
    importUrl = decodeURIComponent(importUrl)
  } catch {
    // Leave the URL percent-encoded, it parses back to the same hues either way
  }

  return `console.error(${JSON.stringify(`Themer: importing your Studio theme from ${url.origin} is deprecated.
Install @sanity/themer to get the exact same theme from npm, without a network request:

  npm install @sanity/themer

Then replace the import with:

  import {buildThemeFromUrl} from '@sanity/themer/legacy'

  const theme = buildThemeFromUrl(
    '${importUrl}'
  )

Read more: https://www.npmjs.com/package/@sanity/themer`)})`
}

const headers = (serverTiming: ServerTimingInstance) => ({
  'Access-Control-Allow-Origin': '*',
  // Test https://vercel.com/docs/concepts/functions/serverless-functions/edge-caching#stale-while-revalidate
  'Cache-Control': `s-maxage=1, stale-while-revalidate`,
  // @TODO enable the below cache header once we have a migration path
  // 'Cache-Control': 'public,max-age=31536000,immutable',
  'Content-Type': 'application/javascript; charset=utf-8',
  'Server-Timing': `${serverTiming}`,
})

export default async function handler(req: NextRequest) {
  const serverTiming = new ServerTiming()
  serverTiming.start('handler')
  const { searchParams } = new URL(req.url)

  try {
    serverTiming.start('getPreset')
    const { searchParams: presetParams } = new URL(
      getPreset(searchParams.get('preset')).url,
      'http://localhost',
    )
    serverTiming.end('getPreset')

    serverTiming.start('themeFromHuesTemplate')
    const res = themeFromHuesTemplate(
      applyHuesFromPreset(presetParams, searchParams),
      searchParams.get('min') !== '0',
    )
    serverTiming.end('themeFromHuesTemplate')

    return new Response(`${migrationNotice(req.url)}\n${res}`, {
      headers: headers(serverTiming),
    })
  } catch (err) {
    if (err instanceof ValidationError) {
      return new Response(
        `throw new TypeError(${JSON.stringify(err.message)})`,
        { headers: headers(serverTiming) },
      )
    }
    throw err
  }
}
