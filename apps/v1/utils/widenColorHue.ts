/**
 * Yes a lot of the code here is gnarly, nasty and overly defensive.
 * That's because this file is currently in Stage 1 "Make it work".
 * The next two stages will be "Make right" and "Make it fast".
 * Stage 2 requires integrtation tests.
 */

import { parseToHsl, setHue } from 'polished'

export function widenColorHue(
  a: string,
  b: string,
  lower: number,
  upper: number,
): string {
  const aHsl = parseToHsl(a)
  const bHsl = parseToHsl(b)

  const withinLowerBounds = aHsl.hue > bHsl.hue && aHsl.hue < bHsl.hue + lower
  const withinUpperBounds = aHsl.hue < bHsl.hue && aHsl.hue > bHsl.hue - upper
  if (withinLowerBounds || withinUpperBounds) {
    const moveDown = bHsl.hue + lower
    const moveUp = bHsl.hue - upper
    if (moveDown - aHsl.hue > moveUp - aHsl.hue) {
      return setHue(moveUp, a)
    }
    return setHue(moveDown, a)
  }
  if (aHsl.hue < bHsl.hue && aHsl.hue > bHsl.hue - upper) {
    return setHue(bHsl.hue - upper, a)
  }

  return a
}
