import { applyHues } from 'utils/applyHues'
import { parseHuesFromSearchParams } from 'utils/parseHuesFromSearchParams'
import type { Hues } from 'utils/types'

export function applyHuesFromPreset(
  presetParams: URLSearchParams,
  searchParams: URLSearchParams
): Hues {
  const presetHues = applyHues(parseHuesFromSearchParams(presetParams))

  return applyHues(parseHuesFromSearchParams(searchParams), presetHues)
}
