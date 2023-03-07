import { type ThemeColorSchemeKey } from '@sanity/ui'
import { memo, useLayoutEffect } from 'react'
import { useColorScheme } from 'sanity'

interface Props {
  forceScheme: ThemeColorSchemeKey
}
const SyncColorScheme = ({ forceScheme }: Props) => {
  const { scheme, setScheme } = useColorScheme()

  useLayoutEffect(() => {
    if (scheme !== forceScheme) {
      console.count('Force syncing scheme')
      setScheme(forceScheme)
    }
  }, [scheme, forceScheme, setScheme])

  return null
}

export default memo(SyncColorScheme)
