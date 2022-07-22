import { applyHues } from 'utils/applyHues'
import { parseHuesFromSearchParams } from 'utils/parseHuesFromSearchParams'
import { defaultPreset, getPreset } from 'utils/presets'

test('Default preset URL is in sync with hue defaults', () => {
  const { searchParams } = new URL(defaultPreset.url, 'http://localhost')
  const hues = parseHuesFromSearchParams(searchParams)
  expect(hues).toEqual(applyHues({}))
})

describe('getPreset', () => {
  test('Is case insensitive', () => {
    expect(getPreset('VERdanT')).toMatchObject({
      slug: 'verdant',
    })
  })

  test('Returns the default preset if none found', () => {
    expect(getPreset('invalid')).toBe(defaultPreset)
  })
})
