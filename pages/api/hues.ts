import { themeFromHuesTemplate } from 'edge-utils/themeFromHuesTemplate.mjs'
import type { NextRequest } from 'next/server'
import { applyHuesFromPreset } from 'utils/applyHuesFromPreset'
import { getPreset } from 'utils/presets'
import { type ServerTimingInstance, ServerTiming } from 'utils/ServerTiming'
import { ValidationError } from 'utils/ValidationError'

export const config = {
  runtime: 'experimental-edge',
}

const headers = (serverTiming: ServerTimingInstance) => ({
  'Access-Control-Allow-Origin': '*',
  // @TODO force no caching until we have a better solution that limits bandwidth without causing trouble
  // 'cache-control': 'no-cache',
  // Test https://vercel.com/docs/concepts/functions/serverless-functions/edge-caching#stale-while-revalidate
  'Cache-Control': `s-maxage=1, stale-while-revalidate`,
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
      'http://localhost'
    )
    serverTiming.end('getPreset')

    serverTiming.start('themeFromHuesTemplate')
    const res = themeFromHuesTemplate(
      applyHuesFromPreset(presetParams, searchParams),
      searchParams.has('min')
    )
    serverTiming.end('themeFromHuesTemplate')

    return new Response(res, { headers: headers(serverTiming) })
  } catch (err) {
    if (err instanceof ValidationError) {
      return new Response(
        `throw new TypeError(${JSON.stringify(err.message)})`,
        { headers: headers(serverTiming) }
      )
    }
    throw err
  }
}
