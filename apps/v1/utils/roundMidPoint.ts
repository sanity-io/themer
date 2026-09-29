import type { Hue } from 'utils/types'

export function roundMidPoint(value: number): Hue['midPoint'] {
  if (value < 75) {
    return 50
  }
  if (value > 925) {
    return 950
  }

  return (Math.round(value / 100) * 100) as Hue['midPoint']
}
