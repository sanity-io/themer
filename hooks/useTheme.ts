import { createColorTheme, rgba, studioTheme } from '@sanity/ui'
import { useMemo } from 'react'
import type { StudioTheme } from 'sanity'
import type { PartialDeep } from 'type-fest'
import { multiply, screen } from 'utils/color-fns'
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
