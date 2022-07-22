import { type ThemeColorToneKey } from '@sanity/ui'
import ImageColorPaletteGrid from 'components/ImageColorPaletteGrid'
import {
  PaletteVariantsLayout,
  WarningMessage,
} from 'components/ImportFromImage.styles'
import { Button, Label } from 'components/Sidebar.styles'
import { parseToHsl, setLightness, setSaturation } from 'polished'
import spacer from 'public/1x1.png'
import {
  type Dispatch,
  type SetStateAction,
  type TransitionStartFunction,
  memo,
  useCallback,
  useMemo,
} from 'react'
import { MediaPreview } from 'sanity/_unstable'
import styled from 'styled-components'
import { suspend } from 'suspend-react'
import { applyHues } from 'utils/applyHues'
import { useFetcher } from 'utils/fetcher'
import { getMidPointFromLuminance } from 'utils/getMidPointFromLuminance'
import { defaultPreset } from 'utils/presets'
import type { Hues, ThemePreset } from 'utils/types'
import { widenColorHue } from 'utils/widenColorHue'

const imageSize = 75

// Using a img element is a nasty workaround to get the nice semi-transparent inset box-shadow styling in MediaPreview, it only works with <img> elements in the `media` prop
const ColorPreview = styled.img.attrs({
  alt: '',
  height: imageSize,
  width: imageSize,
  decoding: 'async',
  loading: 'lazy',
  src: spacer.src,
})``
const ColorMediaPreview = ({
  color,
  dominant,
  population,
}: {
  color: string
  dominant: string
  population: number
}) => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(navigator.languages as any, {
        style: 'percent',
        maximumFractionDigits: 2,
      }),
    []
  )
  const subtitle = formatter.format(Math.max(population / 100, 0.0001))
  return (
    <MediaPreview
      media={<ColorPreview style={{ background: color }} />}
      title={color}
      subtitle={dominant === color ? `${subtitle}, dominant` : subtitle}
      withRadius
    />
  )
}

const PaletteImagePreview = ({ url }: { url: string }) => {
  suspend(async () => {
    const loadPromise = new Promise((resolve) => {
      const img = new Image()
      img.onload = resolve
      img.onerror = resolve
      img.src = url
    })
    // @TODO run timeout race
    await loadPromise
  }, [url])

  return (
    <MediaPreview
      media={
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          decoding="async"
          height={imageSize}
          loading="lazy"
          src={url}
          width={imageSize}
        />
      }
      withRadius
    />
  )
}

interface Props {
  prepareTransition: () => void
  startTransition: TransitionStartFunction
  setPreset: Dispatch<SetStateAction<ThemePreset>>
  projectId: string
  dataset: string
  id: string
}
function ImportFromSanityImageAsset({
  projectId,
  dataset,
  id,
  startTransition,
  prepareTransition,
  setPreset,
}: Props) {
  const data = useFetcher(`/api/palette/${projectId}/${dataset}/${id}`)

  const imageUrl = useMemo(() => {
    const [, ref, dimensions, ext] = id.split('-')
    const url = new URL(
      `/images/${projectId}/${dataset}/${ref}-${dimensions}.${ext}`,
      'https://cdn.sanity.io'
    )
    url.searchParams.set('w', `${imageSize}`)
    url.searchParams.set('h', `${imageSize}`)
    url.searchParams.set('fit', 'crop')
    url.searchParams.set('auto', 'format')

    return url.toString()
  }, [dataset, id, projectId])

  const createNextPreset = useCallback(
    () => [new URL('/api/hues', location.origin), applyHues({})] as const,
    []
  )
  const setNextPreset = useCallback(
    (url: URL) => {
      prepareTransition()
      startTransition(() =>
        // @TODO update the preset name and slug instead of re-using the existing one, show in the MenuDropdown that a custom preset is in effect
        setPreset({ ...defaultPreset, url: `${url.pathname}${url.search}` })
      )
    },
    [prepareTransition, setPreset, startTransition]
  )
  const setHueSearchParam = useCallback(
    (
      tone: ThemeColorToneKey,
      _mid: string,
      _lightest: string,
      _darkest: string,
      searchParams: URLSearchParams
    ) => {
      const mid = _mid.replace(/^#/, '')
      const midPoint = getMidPointFromLuminance(_mid)
      const lightest = _lightest.replace(/^#/, '')
      const darkest = _darkest.replace(/^#/, '')
      searchParams.set(
        tone,
        `${mid};${midPoint};lightest:${lightest};darkest:${darkest}`
      )
    },
    []
  )

  const setPositiveCautionCritical = useCallback(
    (
      url: URL,
      defaults: Hues,
      primary: string,
      lightest: string,
      darkest: string
    ) => {
      const { searchParams } = url

      const positiveMid = widenColorHue(defaults.positive.mid, primary, 12, 12)
      const cautionMid = widenColorHue(defaults.caution.mid, primary, 12, 12)
      const criticalMid = widenColorHue(defaults.critical.mid, primary, 12, 12)

      setHueSearchParam(
        'positive',
        positiveMid,
        lightest,
        darkest,
        searchParams
      )
      setHueSearchParam('caution', cautionMid, lightest, darkest, searchParams)
      setHueSearchParam(
        'critical',
        criticalMid,
        lightest,
        darkest,
        searchParams
      )
    },
    [setHueSearchParam]
  )
  const createThemeFromPalette = useCallback(
    (
      url: URL,
      defaults: Hues,
      {
        muted,
        lightestLightness,
        darkestLightness,
        saturation,
        vibrant,
        transparentSaturation,
      }: {
        muted: string
        lightestLightness: number
        darkestLightness: number
        saturation: number
        vibrant: string
        transparentSaturation: number
      }
    ) => {
      const { searchParams } = url

      const baseHsl = parseToHsl(muted)
      const base =
        baseHsl.saturation > saturation
          ? setSaturation(saturation, muted)
          : muted
      const _lightest =
        baseHsl.lightness < lightestLightness
          ? setLightness(lightestLightness, muted)
          : muted
      const lightest =
        parseToHsl(_lightest).saturation > transparentSaturation
          ? setSaturation(transparentSaturation, _lightest)
          : _lightest
      const _darkest =
        baseHsl.lightness > darkestLightness
          ? setLightness(darkestLightness, muted)
          : muted
      const darkest =
        parseToHsl(_darkest).saturation > transparentSaturation
          ? setSaturation(transparentSaturation, _darkest)
          : _darkest
      const transparent =
        parseToHsl(base).saturation > transparentSaturation
          ? setSaturation(transparentSaturation, base)
          : base
      const primaryMid = vibrant

      setHueSearchParam('default', base, lightest, darkest, searchParams)
      setHueSearchParam('primary', primaryMid, lightest, darkest, searchParams)
      setHueSearchParam(
        'transparent',
        transparent,
        lightest,
        darkest,
        searchParams
      )

      setPositiveCautionCritical(url, defaults, primaryMid, lightest, darkest)
    },
    [setHueSearchParam, setPositiveCautionCritical]
  )

  const experimentalTheme = useCallback(() => {
    // @TODO https://tympanus.net/codrops/2021/12/07/coloring-with-code-a-programmatic-approach-to-design/
  }, [])
  const mutedTheme = useCallback(() => {
    const [url, defaults] = createNextPreset()

    createThemeFromPalette(url, defaults, {
      vibrant: data.muted.background,
      saturation: 0.02,
      lightestLightness: 1,
      darkestLightness: 0.067,
      transparentSaturation: 0.01,
      muted:
        data.dominant.background === data.muted.background
          ? data.vibrant.background
          : data.dominant.background,
    })

    setNextPreset(url)
  }, [
    createThemeFromPalette,
    createNextPreset,
    data?.dominant.background,
    data?.muted.background,
    data?.vibrant.background,
    setNextPreset,
  ])
  const vibrantTheme = useCallback(() => {
    const [url, defaults] = createNextPreset()

    createThemeFromPalette(url, defaults, {
      vibrant: data.vibrant.background,
      saturation: 1,
      lightestLightness: 0.99,
      darkestLightness: 0.067,
      transparentSaturation: 0.25,
      muted: data.muted.background,
    })

    setNextPreset(url)
  }, [
    createNextPreset,
    createThemeFromPalette,
    data?.muted.background,
    data?.vibrant.background,
    setNextPreset,
  ])
  const lightMutedTheme = useCallback(() => {
    const [url, defaults] = createNextPreset()

    createThemeFromPalette(url, defaults, {
      vibrant: data.lightMuted.background,
      saturation: 0.02,
      lightestLightness: 0.98,
      darkestLightness: 0.067,
      transparentSaturation: 0.02,
      muted:
        data.dominant.background === data.lightMuted.background
          ? data.lightVibrant.background
          : data.dominant.background,
    })

    setNextPreset(url)
  }, [
    createThemeFromPalette,
    createNextPreset,
    data?.dominant.background,
    data?.lightMuted.background,
    data?.lightVibrant.background,
    setNextPreset,
  ])
  const lightVibrantTheme = useCallback(() => {
    const [url, defaults] = createNextPreset()

    createThemeFromPalette(url, defaults, {
      vibrant: data.lightVibrant.background,
      saturation: 1,
      lightestLightness: 0.99,
      darkestLightness: 0.067,
      transparentSaturation: 0.25,
      muted: data.lightMuted.background,
    })

    setNextPreset(url)
  }, [
    createNextPreset,
    createThemeFromPalette,
    data?.lightMuted.background,
    data?.lightVibrant.background,
    setNextPreset,
  ])
  const darkMutedTheme = useCallback(() => {
    const [url, defaults] = createNextPreset()

    createThemeFromPalette(url, defaults, {
      vibrant: data.darkMuted.background,
      saturation: 0.02,
      lightestLightness: 0.99,
      darkestLightness: 0.03,
      transparentSaturation: 0.04,
      muted:
        data.dominant.background === data.darkMuted.background
          ? data.darkVibrant.background
          : data.dominant.background,
    })

    setNextPreset(url)
  }, [
    createThemeFromPalette,
    createNextPreset,
    data?.darkMuted.background,
    data?.darkVibrant.background,
    data?.dominant.background,
    setNextPreset,
  ])
  const darkVibrantTheme = useCallback(() => {
    const [url, defaults] = createNextPreset()

    createThemeFromPalette(url, defaults, {
      vibrant: data.darkVibrant.background,
      saturation: 1,
      lightestLightness: 0.99,
      darkestLightness: 0.067,
      transparentSaturation: 0.25,
      muted: data.darkMuted.background,
    })

    setNextPreset(url)
  }, [
    createNextPreset,
    createThemeFromPalette,
    data?.darkMuted.background,
    data?.darkVibrant.background,
    setNextPreset,
  ])
  const autoTheme = useCallback(() => {
    switch (data.dominant.background) {
      case data.muted.background:
        return mutedTheme()
      case data.lightMuted.background:
        return lightMutedTheme()
      case data.darkMuted.background:
        return darkMutedTheme()
      case data.vibrant.background:
        return vibrantTheme()
      case data.lightVibrant.background:
        return lightVibrantTheme()
      case data.darkVibrant.background:
        return darkVibrantTheme()
      default:
        throw new Error('Failed to find a theme automatically')
    }
  }, [
    darkMutedTheme,
    darkVibrantTheme,
    data?.darkMuted.background,
    data?.darkVibrant.background,
    data?.dominant.background,
    data?.lightMuted.background,
    data?.lightVibrant.background,
    data?.muted.background,
    data?.vibrant.background,
    lightMutedTheme,
    lightVibrantTheme,
    mutedTheme,
    vibrantTheme,
  ])

  if (!data) {
    return (
      <WarningMessage message="Failed to fetch color palette, double-check the URL or retry in a minute if it's a recently uploaded image asset" />
    )
  }

  return (
    <PaletteVariantsLayout
      paletteLabel={<Label>Image Color Palette</Label>}
      paletteGrid={
        <ImageColorPaletteGrid
          image={<PaletteImagePreview url={imageUrl} />}
          muted={
            <ColorMediaPreview
              color={data.muted.background}
              population={data.muted.population}
              dominant={data.dominant.background}
            />
          }
          vibrant={
            <ColorMediaPreview
              color={data.vibrant.background}
              population={data.vibrant.population}
              dominant={data.dominant.background}
            />
          }
          lightMuted={
            <ColorMediaPreview
              color={data.lightMuted.background}
              population={data.lightMuted.population}
              dominant={data.dominant.background}
            />
          }
          darkMuted={
            <ColorMediaPreview
              color={data.darkMuted.background}
              population={data.darkMuted.population}
              dominant={data.dominant.background}
            />
          }
          lightVibrant={
            <ColorMediaPreview
              color={data.lightVibrant.background}
              population={data.lightVibrant.population}
              dominant={data.dominant.background}
            />
          }
          darkVibrant={
            <ColorMediaPreview
              color={data.darkVibrant.background}
              population={data.darkVibrant.population}
              dominant={data.dominant.background}
            />
          }
        />
      }
      label={<Label>Choose a variant</Label>}
    >
      <Button
        text="Auto"
        style={{ gridColumn: '1 / 3' }}
        tone="primary"
        onClick={autoTheme}
      />
      {/* @TODO implement an experimental theme */}
      {/* <Button text="Experimental" tone="critical" onClick={experimentalTheme} /> */}
      <Button text="Muted" onClick={mutedTheme} />
      <Button text="Vibrant" onClick={vibrantTheme} />
      <Button text="Light muted" onClick={lightMutedTheme} />
      <Button text="Light vibrant" onClick={lightVibrantTheme} />
      <Button text="Dark muted" onClick={darkMutedTheme} />
      <Button text="Dark vibrant" onClick={darkVibrantTheme} />
    </PaletteVariantsLayout>
  )
}

export default memo(ImportFromSanityImageAsset)
