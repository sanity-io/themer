import { applyHuesFromPreset } from 'utils/applyHuesFromPreset'
import { defaultPreset, getPreset } from 'utils/presets'
import { shortenPresetSearchParams } from 'utils/shortenPresetSearchParams'

test('hoists duplicate lightest values', () => {
  let url = new URL(defaultPreset.url, 'http://localhost')
  let searchParams = new URLSearchParams(url.search)
  // @TODO use this technique to test other presets
  // url.searchParams.set('preset', defaultPreset.slug)

  // Snap before altering
  expect(decodeURIComponent(searchParams.toString())).toMatchInlineSnapshot(
    `"lightest=fff&darkest=101112&default=8690a0;500&primary=2276fc;500&transparent=8690a0;500&positive=43d675;400&caution=fbd024;300&critical=f03e2f;500"`
  )

  searchParams.delete('lightest')
  searchParams.set('default', `${searchParams.get('default')};lightest:f00`)
  searchParams.set('primary', `${searchParams.get('primary')};lightest:f00`)
  searchParams.set(
    'transparent',
    `${searchParams.get('transparent')};lightest:f00`
  )
  searchParams.set('positive', `${searchParams.get('positive')};lightest:f00`)
  // Give caution a different lightest, and don't modify critical
  searchParams.set('caution', `${searchParams.get('caution')};lightest:ff0`)
  // Snap after modifying
  expect(decodeURIComponent(searchParams.toString())).toMatchInlineSnapshot(
    `"darkest=101112&default=8690a0;500;lightest:f00&primary=2276fc;500;lightest:f00&transparent=8690a0;500;lightest:f00&positive=43d675;400;lightest:f00&caution=fbd024;300;lightest:ff0&critical=f03e2f;500"`
  )

  let shorterParams = new URLSearchParams(searchParams)
  shortenPresetSearchParams(shorterParams)
  expect(decodeURIComponent(shorterParams.toString())).toMatchInlineSnapshot(
    `"caution=lightest:ff0&critical=lightest:fff&lightest=f00"`
  )
  // With global lightest, it should remove duplicates from the other tones
  expect(shorterParams.get('default')).not.toBe('lightest:f00')
  expect(shorterParams.get('primary')).not.toBe('lightest:f00')
  expect(shorterParams.get('transparent')).not.toBe('lightest:f00')
  expect(shorterParams.get('positive')).not.toBe('lightest:f00')
  expect(shorterParams.get('caution')).not.toBe('lightest:f00')
  expect(shorterParams.get('critical')).not.toBe('lightest:f00')

  // Verify the same hues are produced with both URLs
  let presetParams = new URLSearchParams(url.search)
  let expected = applyHuesFromPreset(presetParams, searchParams)
  let result = applyHuesFromPreset(presetParams, shorterParams)
  expect(result.default.lightest).toBe('#f00')
  expect(result.primary.lightest).toBe('#f00')
  expect(result.transparent.lightest).toBe('#f00')
  expect(result.positive.lightest).toBe('#f00')
  // Caution is given a different lightest than the others, it should stay intact
  expect(result.caution.lightest).toBe('#ff0')
  // The global lightest param isn't added initially, thus the lightest color for critical should still be #fff
  expect(result.critical.lightest).toBe('#fff')
  expect(expected).toEqual(result)
})

test('hoists duplicate darkest values', () => {
  let url = new URL(defaultPreset.url, 'http://localhost')
  let searchParams = new URLSearchParams(url.search)
  // @TODO use this technique to test other presets
  // url.searchParams.set('preset', defaultPreset.slug)

  // Snap before altering
  expect(decodeURIComponent(searchParams.toString())).toMatchInlineSnapshot(
    `"lightest=fff&darkest=101112&default=8690a0;500&primary=2276fc;500&transparent=8690a0;500&positive=43d675;400&caution=fbd024;300&critical=f03e2f;500"`
  )

  searchParams.delete('darkest')
  searchParams.set('default', `${searchParams.get('default')};darkest:f00`)
  searchParams.set('primary', `${searchParams.get('primary')};darkest:f00`)
  searchParams.set(
    'transparent',
    `${searchParams.get('transparent')};darkest:f00`
  )
  searchParams.set('positive', `${searchParams.get('positive')};darkest:f00`)
  // Give caution a different darkest, and don't modify critical
  searchParams.set('caution', `${searchParams.get('caution')};darkest:ff0`)
  // Snap after modifying
  expect(decodeURIComponent(searchParams.toString())).toMatchInlineSnapshot(
    `"lightest=fff&default=8690a0;500;darkest:f00&primary=2276fc;500;darkest:f00&transparent=8690a0;500;darkest:f00&positive=43d675;400;darkest:f00&caution=fbd024;300;darkest:ff0&critical=f03e2f;500"`
  )

  const shorterParams = new URLSearchParams(searchParams)
  shortenPresetSearchParams(shorterParams)
  expect(decodeURIComponent(shorterParams.toString())).toMatchInlineSnapshot(
    `"caution=darkest:ff0&critical=darkest:101112&darkest=f00"`
  )
  // With global darkest, it should remove duplicates from the other tones
  expect(shorterParams.get('default')).not.toBe('darkest:f00')
  expect(shorterParams.get('primary')).not.toBe('darkest:f00')
  expect(shorterParams.get('transparent')).not.toBe('darkest:f00')
  expect(shorterParams.get('positive')).not.toBe('darkest:f00')
  expect(shorterParams.get('caution')).not.toBe('darkest:f00')
  expect(shorterParams.get('critical')).not.toBe('darkest:f00')

  // Verify the same hues are produced with both URLs
  const presetParams = new URLSearchParams(url.search)
  const expected = applyHuesFromPreset(presetParams, searchParams)
  const result = applyHuesFromPreset(presetParams, shorterParams)
  expect(result.default.darkest).toBe('#f00')
  expect(result.primary.darkest).toBe('#f00')
  expect(result.transparent.darkest).toBe('#f00')
  expect(result.positive.darkest).toBe('#f00')
  // Caution is given a different darkest than the others, it should stay intact
  expect(result.caution.darkest).toBe('#ff0')
  // The global darkest param isn't added initially, thus the darkest color for critical should still be #fff
  expect(result.critical.darkest).toBe('#101112')
  expect(expected).toEqual(result)
})

test('&lightest overrides preset values', () => {
  const searchParams = new URLSearchParams('?preset=verdant&lightest=effefe')
  shortenPresetSearchParams(searchParams)
  expect(decodeURIComponent(searchParams.toString())).toMatchInlineSnapshot(
    `"preset=verdant&lightest=effefe"`
  )
  const lightest = '#effefe'
  expect(
    applyHuesFromPreset(
      new URL(getPreset(searchParams.get('preset')).url, 'http://localhost')
        .searchParams,
      searchParams
    )
  ).toMatchObject({
    default: { lightest },
    primary: { lightest },
    transparent: { lightest },
    positive: { lightest },
    caution: { lightest },
    critical: { lightest },
  })
})

test('&darkest overrides preset values', () => {
  const searchParams = new URLSearchParams('?preset=verdant&darkest=264d61')
  shortenPresetSearchParams(searchParams)
  expect(decodeURIComponent(searchParams.toString())).toMatchInlineSnapshot(
    `"preset=verdant&darkest=264d61"`
  )
  const darkest = '#264d61'
  expect(
    applyHuesFromPreset(
      new URL(getPreset(searchParams.get('preset')).url, 'http://localhost')
        .searchParams,
      searchParams
    )
  ).toMatchObject({
    default: { darkest },
    primary: { darkest },
    transparent: { darkest },
    positive: { darkest },
    caution: { darkest },
    critical: { darkest },
  })
})

test('midPoint 500 is optional', () => {
  const searchParams = new URLSearchParams('?preset=verdant&primary=51b4d0')
  shortenPresetSearchParams(searchParams)
  expect(decodeURIComponent(searchParams.toString())).toMatchInlineSnapshot(
    `"preset=verdant&primary=51b4d0"`
  )
  expect(searchParams.get('primary')).toBe('51b4d0')
  expect(
    applyHuesFromPreset(
      new URL(getPreset(searchParams.get('preset')).url, 'http://localhost')
        .searchParams,
      searchParams
    )
  ).toMatchObject({ primary: { mid: '#51b4d0', midPoint: 500 } })
  searchParams.set('caution', 'fde047;300')
  shortenPresetSearchParams(searchParams)
  expect(decodeURIComponent(searchParams.toString())).toMatchInlineSnapshot(
    `"preset=verdant&primary=51b4d0&caution=fde047;300"`
  )
  expect(searchParams.get('caution')).toBe('fde047;300')
  expect(
    applyHuesFromPreset(
      new URL(getPreset(searchParams.get('preset')).url, 'http://localhost')
        .searchParams,
      searchParams
    )
  ).toMatchObject({ caution: { mid: '#fde047', midPoint: 300 } })
})

test('hues that are equal to the preset are optional', () => {
  let searchParams = new URLSearchParams(
    '?preset=dew&default=5e63b4;600&primary=d1a308;400&transparent=6c6fa7;500&positive=43D675;300&caution=fb9f24;400&critical=F03E2F;500'
  )
  shortenPresetSearchParams(searchParams)
  expect(decodeURIComponent(searchParams.toString())).toMatchInlineSnapshot(
    `"preset=dew"`
  )
  expect(
    applyHuesFromPreset(
      new URL(getPreset(searchParams.get('preset')).url, 'http://localhost')
        .searchParams,
      searchParams
    )
  ).toMatchObject({
    default: { mid: `#5e63b4`, midPoint: 600 },
    primary: { mid: '#d1a308', midPoint: 400 },
    transparent: { mid: '#6c6fa7', midPoint: 500 },
    positive: { mid: '#43d675', midPoint: 300 },
    caution: { mid: '#fb9f24', midPoint: 400 },
    critical: { mid: '#f03e2f', midPoint: 500 },
  })

  searchParams = new URLSearchParams(
    '?preset=dew&default=4e63b4;600&primary=d0a308;400&transparent=5c6fa7;500&positive=33D675;300&caution=fb8f24;400&critical=F02E2F;500'
  )
  shortenPresetSearchParams(searchParams)
  expect(decodeURIComponent(searchParams.toString())).toMatchInlineSnapshot(
    `"preset=dew&default=4e63b4;600&primary=d0a308;400&transparent=5c6fa7&positive=33d675;300&caution=fb8f24;400&critical=f02e2f"`
  )
  expect(
    applyHuesFromPreset(
      new URL(getPreset(searchParams.get('preset')).url, 'http://localhost')
        .searchParams,
      searchParams
    )
  ).toMatchObject({
    default: { mid: `#4e63b4`, midPoint: 600 },
    primary: { mid: '#d0a308', midPoint: 400 },
    transparent: { mid: '#5c6fa7', midPoint: 500 },
    positive: { mid: '#33d675', midPoint: 300 },
    caution: { mid: '#fb8f24', midPoint: 400 },
    critical: { mid: '#f02e2f', midPoint: 500 },
  })
})

// Guard against determinism, if `default=100` it's treated as mid=#100 to support shorthand hexcodes
// Thus if the midPoint exists it must be preceded by a `mid` to ensure the parser does its job
test('If hues are the same but midPoints have changed do not strip out the hue', () => {
  let searchParams = new URLSearchParams(
    '?preset=dew&default=5e63b4;600&primary=d1a308;400&transparent=6c6fa7;500&positive=43D675;300&caution=fb9f24;400&critical=F03E2F;500'
  )
  shortenPresetSearchParams(searchParams)
  expect(decodeURIComponent(searchParams.toString())).toMatchInlineSnapshot(
    `"preset=dew"`
  )
  expect(
    applyHuesFromPreset(
      new URL(getPreset(searchParams.get('preset')).url, 'http://localhost')
        .searchParams,
      searchParams
    )
  ).toMatchObject({
    default: { mid: `#5e63b4`, midPoint: 600 },
    primary: { mid: '#d1a308', midPoint: 400 },
    transparent: { mid: '#6c6fa7', midPoint: 500 },
    positive: { mid: '#43d675', midPoint: 300 },
    caution: { mid: '#fb9f24', midPoint: 400 },
    critical: { mid: '#f03e2f', midPoint: 500 },
  })

  searchParams = new URLSearchParams(
    '?preset=dew&default=5e63b4;500&primary=d1a308;300&transparent=6c6fa7;400&positive=43D675;200&caution=fb9f24;300&critical=F03E2F;400'
  )
  shortenPresetSearchParams(searchParams)
  expect(decodeURIComponent(searchParams.toString())).toMatchInlineSnapshot(
    `"preset=dew&default=5e63b4;500&primary=d1a308;300&transparent=6c6fa7;400&positive=43d675;200&caution=fb9f24;300&critical=f03e2f;400"`
  )
  expect(
    applyHuesFromPreset(
      new URL(getPreset(searchParams.get('preset')).url, 'http://localhost')
        .searchParams,
      searchParams
    )
  ).toMatchObject({
    default: { mid: `#5e63b4`, midPoint: 500 },
    primary: { mid: '#d1a308', midPoint: 300 },
    transparent: { mid: '#6c6fa7', midPoint: 400 },
    positive: { mid: '#43d675', midPoint: 200 },
    caution: { mid: '#fb9f24', midPoint: 300 },
    critical: { mid: '#f03e2f', midPoint: 400 },
  })
})
