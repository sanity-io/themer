import { type ColorTints, COLOR_TINTS } from '@sanity/color'
import { mix } from 'polished'
import type { Hue, Hues } from 'utils/types'

export function createTonesFromHues(hues: Hues): {
  default: ColorTints
  primary: ColorTints
  transparent: ColorTints
  positive: ColorTints
  caution: ColorTints
  critical: ColorTints
} {
  return {
    default: createTintsFromHue(hues.default, 'Default'),
    primary: createTintsFromHue(hues.primary, 'Primary'),
    transparent: createTintsFromHue(hues.transparent, 'Transparent'),
    positive: createTintsFromHue(hues.positive, 'Positive'),
    caution: createTintsFromHue(hues.caution, 'Caution'),
    critical: createTintsFromHue(hues.critical, 'Critical'),
  }
}

// https://github.com/sanity-io/design/blob/804bf73dffb1c0ecb1c2e6758135784502768bfe/packages/%40sanity/color/scripts/generate.ts#L42-L58
export function createTintsFromHue(hue: Hue, title: string): ColorTints {
  const initial = {} as ColorTints
  const tints = COLOR_TINTS.reduce((acc, tint) => {
    acc[tint] = {
      title: `${title} ${tint}`,
      hex: getColorHex(hue, tint),
    }

    return acc
  }, initial)

  return tints
}

// https://github.com/sanity-io/design/blob/804bf73dffb1c0ecb1c2e6758135784502768bfe/packages/%40sanity/color/scripts/generate.ts#L18-L58
function getColorHex(
  // Making title optional as it's not used but we don't consider it a type error if it's provided
  hue: Hue & { title?: string },
  tint: string
): string {
  const tintNum = Number(tint)
  const midPoint = hue.midPoint
  const darkSize = 1000 - midPoint
  const lightPosition = tintNum / midPoint
  const darkPosition = (tintNum - midPoint) / darkSize

  if (tintNum === midPoint) {
    return hue.mid.toLowerCase()
  }

  // light side of scale: x < midPoint
  if (tintNum < midPoint) {
    return mix(lightPosition, hue.mid, hue.lightest)
  }

  // dark side of scale: x > midPoint
  return mix(darkPosition, hue.darkest, hue.mid)
}
