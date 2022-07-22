import { getLuminance } from 'polished'

export function getMidPointFromLuminance(color: string): number {
  const luminance = getLuminance(color)
  const corrected = 1 - luminance
  const tint = corrected * 650

  // TODO should round by 100, except for 50 and 950

  return Math.round(tint / 100) * 100
}
