import {
  createColorTheme,
  multiply,
  parseColor,
  rgba,
  rgbToHex,
  screen,
  studioTheme,
} from '@sanity/ui'
import { useMemo } from 'react'
import type { StudioTheme } from 'sanity'
import type { PartialDeep } from 'type-fest'
import { themeFromHues } from 'utils/themeFromHues'
import type { Hues } from 'utils/types'

interface CreateThemeProps {
  hues: PartialDeep<Hues>
}
export function createTheme({ hues }: CreateThemeProps): StudioTheme {
  return themeFromHues({
    hues,
    studioTheme,
    multiply,
    screen,
    parseColor,
    rgbToHex,
    rgba,
    createColorTheme,
  })
}
interface ThemeFromHuesProps {
  hues: PartialDeep<Hues>
}
export function useThemeFromHues({ hues }: ThemeFromHuesProps): StudioTheme {
  return useMemo(() => createTheme({ hues }), [hues])
}
