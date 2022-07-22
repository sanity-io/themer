import { applyHues } from 'utils/applyHues'
import type { Hues } from 'utils/types'

const defaultHues: Hues = {
  default: {
    lightest: '#cfcfcf',
    darkest: '#000',
    mid: '#8690a0',
    midPoint: 600,
  },
  primary: {
    lightest: '#cfcfcf',
    darkest: '#000',
    mid: '#2276fc',
    midPoint: 400,
  },
  transparent: {
    lightest: '#cfcfcf',
    darkest: '#000',
    mid: '#8690a0',
    midPoint: 600,
  },
  positive: {
    lightest: '#cfcfcf',
    darkest: '#000',
    mid: '#43d675',
    midPoint: 400,
  },
  caution: {
    lightest: '#cfcfcf',
    darkest: '#000',
    mid: '#fbd024',
    midPoint: 300,
  },
  critical: {
    lightest: '#cfcfcf',
    darkest: '#000',
    mid: '#f03e2f',
    midPoint: 700,
  },
}

const lightest = expect.any(String)
const darkest = expect.any(String)
const mid = expect.any(String)
const midPoint = expect.any(Number)
test('produces valid defaults', () => {
  expect(applyHues({})).toEqual({
    default: { lightest, darkest, mid, midPoint },
    primary: { lightest, darkest, mid, midPoint },
    transparent: { lightest, darkest, mid, midPoint },
    positive: { lightest, darkest, mid, midPoint },
    caution: { lightest, darkest, mid, midPoint },
    critical: { lightest, darkest, mid, midPoint },
  })
})

test('midPoints reset to 500 if not provided and mid changes', () => {
  expect(
    applyHues(
      {
        default: {
          mid: '#f00',
        },
        primary: {
          mid: '#f00',
        },
        transparent: {
          mid: '#f00',
        },
        positive: {
          mid: '#f00',
        },
        caution: {
          mid: '#f00',
        },
        critical: {
          mid: '#f00',
        },
      },
      defaultHues
    )
  ).toMatchObject({
    default: { midPoint: 500 },
    primary: { midPoint: 500 },
    transparent: { midPoint: 500 },
    positive: { midPoint: 500 },
    caution: { midPoint: 500 },
    critical: { midPoint: 500 },
  })
})

test('midPoints are overridable even when reset', () => {
  expect(
    applyHues(
      {
        default: {
          mid: '#f00',
          midPoint: 100,
        },
        primary: {
          mid: '#f00',
          midPoint: 200,
        },
        transparent: {
          mid: '#f00',
          midPoint: 300,
        },
        positive: {
          mid: '#f00',
          midPoint: 600,
        },
        caution: {
          mid: '#f00',
          midPoint: 700,
        },
        critical: {
          mid: '#f00',
          midPoint: 800,
        },
      },
      defaultHues
    )
  ).toMatchObject({
    default: { midPoint: 100 },
    primary: { midPoint: 200 },
    transparent: { midPoint: 300 },
    positive: { midPoint: 600 },
    caution: { midPoint: 700 },
    critical: { midPoint: 800 },
  })
})

test('undefined keys are handled', () => {
  expect(
    applyHues({
      default: {
        lightest: undefined,
        darkest: undefined,
        mid: undefined,
        midPoint: undefined,
      },
      primary: {
        lightest: undefined,
        darkest: undefined,
        mid: undefined,
        midPoint: undefined,
      },
      transparent: {
        lightest: undefined,
        darkest: undefined,
        mid: undefined,
        midPoint: undefined,
      },
      positive: {
        lightest: undefined,
        darkest: undefined,
        mid: undefined,
        midPoint: undefined,
      },
      caution: {
        lightest: undefined,
        darkest: undefined,
        mid: undefined,
        midPoint: undefined,
      },
      critical: {
        lightest: undefined,
        darkest: undefined,
        mid: undefined,
        midPoint: undefined,
      },
    })
  ).toMatchObject({
    default: { lightest, darkest, mid, midPoint },
    primary: { lightest, darkest, mid, midPoint },
    transparent: { lightest, darkest, mid, midPoint },
    positive: { lightest, darkest, mid, midPoint },
    caution: { lightest, darkest, mid, midPoint },
    critical: { lightest, darkest, mid, midPoint },
  })
})
