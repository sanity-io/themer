/**
 * Yes a lot of the code here is gnarly, nasty and overly defensive.
 * That's because this file is currently in Stage 1 "Make it work".
 * The next two stages will be "Make right" and "Make it fast".
 * Stage 2 requires integrtation tests.
 */

// Removes search params that match defaults specified in the preset

import { applyHues } from 'utils/applyHues'
import { TONES } from 'utils/colors'
import { parseHuesFromSearchParams } from 'utils/parseHuesFromSearchParams'
import { getPreset } from 'utils/presets'
import { stringifyColorSearchParam } from 'utils/stringifyColorSearchParam'

export function shortenPresetSearchParams(searchParams: URLSearchParams) {
  const preset = getPreset(searchParams.get('preset'))
  const { searchParams: presetParams } = new URL(preset.url, 'http://localhost')
  // Get defaults from preset
  const defaults = applyHues(parseHuesFromSearchParams(presetParams))

  const hues = applyHues(parseHuesFromSearchParams(searchParams), defaults)

  // Start off by checking for lightest and darkest duplicates
  const lightestMap = new Map<string, number>()
  const darkestMap = new Map<string, number>()

  for (const tone of TONES) {
    if (defaults[tone].lightest !== hues[tone].lightest) {
      if (!lightestMap.has(hues[tone].lightest)) {
        lightestMap.set(hues[tone].lightest, 0)
      } else {
        lightestMap.set(
          hues[tone].lightest,
          lightestMap.get(hues[tone].lightest) + 1
        )
      }
    }
    if (defaults[tone].darkest !== hues[tone].darkest) {
      if (!darkestMap.has(hues[tone].darkest)) {
        darkestMap.set(hues[tone].darkest, 0)
      } else {
        darkestMap.set(
          hues[tone].darkest,
          darkestMap.get(hues[tone].darkest) + 1
        )
      }
    }
  }

  let lightest
  if (lightestMap.size === TONES.length || lightestMap.size < 1) {
    searchParams.delete('lightest')
  } else {
    let count = 0
    for (const [key, value] of lightestMap) {
      if (value > count) {
        count = value
        lightest = key
      }
    }
    if (lightest) {
      searchParams.set('lightest', stringifyColorSearchParam(lightest))
    }
  }
  let darkest
  if (darkestMap.size === TONES.length || darkestMap.size < 1) {
    searchParams.delete('darkest')
  } else {
    let count = 0
    for (const [key, value] of darkestMap) {
      if (value > count) {
        count = value
        darkest = key
      }
    }
    if (darkest) {
      searchParams.set('darkest', stringifyColorSearchParam(darkest))
    }
  }

  for (const tone of TONES) {
    const baseHue = defaults[tone]
    const hue = hues[tone]
    const shouldSkipLightest = lightest && hue.lightest === lightest
    const shouldSkipDarkest = darkest && hue.darkest === darkest
    const shouldIncludeMid = baseHue.mid !== hue.mid
    const shouldIncludeMidPoint =
      baseHue.mid !== hue.mid && hue.midPoint && hue.midPoint !== 500
        ? true
        : baseHue.mid === hue.mid &&
          baseHue.midPoint !== hue.midPoint &&
          hue.midPoint !== 500
        ? true
        : baseHue.mid !== hue.mid && hue.midPoint !== 500
        ? true
        : baseHue.mid === hue.mid &&
          baseHue.midPoint !== 500 &&
          hue.midPoint === 500
        ? true
        : false
    const param = [
      (shouldIncludeMid || shouldIncludeMidPoint) &&
        stringifyColorSearchParam(hue.mid),
      shouldIncludeMidPoint && hue.midPoint,
      shouldSkipLightest
        ? false
        : lightest && hue.lightest !== lightest
        ? `lightest:${stringifyColorSearchParam(hue.lightest)}`
        : hue.lightest &&
          baseHue.lightest !== hue.lightest &&
          `lightest:${stringifyColorSearchParam(hue.lightest)}`,
      shouldSkipDarkest
        ? false
        : darkest && hue.darkest !== darkest
        ? `darkest:${stringifyColorSearchParam(hue.darkest)}`
        : hue.darkest &&
          baseHue.darkest !== hue.darkest &&
          `darkest:${stringifyColorSearchParam(hue.darkest)}`,
    ]
      .filter(Boolean)
      .join(';')

    if (param === '') {
      searchParams.delete(tone)
    } else {
      searchParams.set(tone, param)
    }
  }
}
