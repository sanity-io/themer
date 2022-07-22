import { TONES } from 'utils/colors'
import { roundMidPoint } from 'utils/roundMidPoint'
import { stringifyColorSearchParam } from 'utils/stringifyColorSearchParam'
import type { Hues } from 'utils/types'

export function expandPresetSearchParams(
  searchParams: URLSearchParams,
  hues: Hues
) {
  for (const tone of TONES) {
    const hue = hues[tone]
    searchParams.set(
      tone,
      `${stringifyColorSearchParam(hue.mid)};${roundMidPoint(
        hue.midPoint
      )};lightest:${stringifyColorSearchParam(
        hue.lightest
      )};darkest:${stringifyColorSearchParam(hue.darkest)}`
    )
  }
}
