import { useMemo } from 'react'
import type { Hue, Hues } from 'utils/types'

export function useMemoHues(hues: Hues): Hues {
  const defaultMemo = useMemoHue(hues.default)
  const primaryMemo = useMemoHue(hues.primary)
  const transparentMemo = useMemoHue(hues.transparent)
  const positiveMemo = useMemoHue(hues.positive)
  const cautionMemo = useMemoHue(hues.caution)
  const criticalMemo = useMemoHue(hues.critical)

  const hashed = useMemo(
    () =>
      JSON.stringify({
        default: defaultMemo,
        primary: primaryMemo,
        transparent: transparentMemo,
        positive: positiveMemo,
        caution: cautionMemo,
        critical: criticalMemo,
      }),
    [
      cautionMemo,
      criticalMemo,
      defaultMemo,
      positiveMemo,
      primaryMemo,
      transparentMemo,
    ]
  )

  return useMemo(() => JSON.parse(hashed), [hashed])
}

function useMemoHue({ mid, midPoint, lightest, darkest }: Hue): Hue {
  const hashed = useMemo(
    () => JSON.stringify({ mid, midPoint, lightest, darkest }),
    [darkest, lightest, mid, midPoint]
  )

  return useMemo(() => JSON.parse(hashed), [hashed])
}
