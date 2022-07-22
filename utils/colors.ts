import { black, hues, white } from '@sanity/color'

export const lightest = white.hex.toLowerCase()
export const darkest = black.hex.toLowerCase()

export const NEUTRAL_TONES = ['default', 'transparent']

export const TONES = [
  'default',
  'primary',
  'transparent',
  'positive',
  'caution',
  'critical',
] as const

export const { blue, cyan, gray, green, magenta, orange, purple, red, yellow } =
  hues
