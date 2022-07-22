import {
  type CardTone,
  type ThemeColorSchemeKey,
  Card,
  Grid,
  LayerProvider,
  ThemeProvider,
  ToastProvider,
} from '@sanity/ui'
import Head from 'components/Head'
import { HeaderCard, useHeaderCard } from 'components/HeaderCard'
import HuesFields from 'components/HuesFields'
import PresetsMenu from 'components/PresetsMenu'
import SchemeMenu from 'components/SchemeMenu'
import { StudioViewer, useStudioViewer } from 'components/StudioViewer'
import ToggleView from 'components/ToggleView'
import { useIdleCallback } from 'hooks/useIdleCallback'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { StudioProviderProps, StudioTheme } from 'sanity'
import { config } from 'studios'
import styled from 'styled-components'
import { suspend } from 'suspend-react'
import type { PartialDeep } from 'type-fest'
import { expandPresetSearchParams } from 'utils/expandPresetSearchParams'
import { shortenPresetSearchParams } from 'utils/shortenPresetSearchParams'
import type { Hue, Hues, ThemePreset } from 'utils/types'

// @TODO read the media query from the theme context instead of hardcoding to 600px
const StyledGrid = styled(Grid)`
  row-gap: 1px;
  @media screen and (min-width: 600px) {
    && {
      grid-template-columns: ${
          // @ts-expect-error
          ({ sidebarWidth }) => sidebarWidth
        }px 1fr;
    }
  }
`

const Sidebar = styled(Card)`
  /* the z-index is necessary to overlay the mobile off-canvas menu */
  z-index: 200;
  height: calc(50vh - 1px);
  max-height: calc(50dvh - 1px);

  @media (min-width: ${({ theme }) => theme.sanity.media[1]}px) {
    height: 100vh;
    max-height: 100dvh;
  }
`

// https://github.com/sanity-io/sanity/blob/afd7010e06eda9acedf4d6654393102e2795fd7b/packages/sanity/src/studio/constants.ts#L4
const Z_OFFSET = {
  toast: [100, 11000],
}

interface Props extends Pick<StudioProviderProps, 'unstable_noAuthBoundary'> {
  initialPreset: ThemePreset
  sidebarWidth: number
  // The scheme detected from the usePrefersDark hook
  systemScheme: ThemeColorSchemeKey
  unstable_showParsedUrl?: boolean
}
export default function Themer({
  sidebarWidth,
  systemScheme,
  initialPreset,
  unstable_noAuthBoundary,
  unstable_showParsedUrl,
}: Props) {
  const [preset, setPreset] = useState(() => initialPreset)

  const { createTheme, initialHues } = suspend(async () => {
    const url = new URL(preset.url, location.origin)
    const { createTheme, hues } = await import(
      /* webpackIgnore: true */ url.toString()
    )

    return {
      createTheme: createTheme as (hues: Hues) => StudioTheme,
      initialHues: hues as Hues,
    }
  }, [preset.url])
  // used by useMemoHues, is updated by local state when syncing
  const [huesState, setHuesState] = useState(initialHues)

  const { spin, spins, transition, startTransition } = useHeaderCard()

  const { view, toggleView } = useStudioViewer({ startTransition })

  // Reset the Hues state when loading a preset on demand
  useEffect(() => {
    startTransition(() => setHuesState(initialHues))
  }, [initialHues, startTransition])
  // Properly memoize the hues state before passing it to the theme creator
  // const memoHues = useMemoHues(huesState)
  // Test if the JSON stringify and parsing is too costly
  const memoHues = huesState
  // Now we can create the theme from the memoed hues
  const themeFromHues = useMemo(
    () => createTheme(memoHues),
    [memoHues, createTheme]
  )

  // Backup hue edits to the current URL
  const backupToUrl = useIdleCallback(
    useCallback(() => {
      const url = new URL(window.location.href)
      url.searchParams.set('preset', preset.slug)
      expandPresetSearchParams(url.searchParams, memoHues)

      if (!url.searchParams.has('pin')) {
        if (preset.slug === 'default') {
          url.searchParams.delete('preset')
        }
        shortenPresetSearchParams(url.searchParams)
      }
      window.history.replaceState({}, '', decodeURIComponent(url.href))
    }, [memoHues, preset.slug]),
    { requestTransition: spin, startTransition }
  )
  useEffect(() => void backupToUrl(), [backupToUrl])

  const [forceScheme, setForceScheme] = useState<ThemeColorSchemeKey | null>(
    null
  )
  const scheme = forceScheme ?? systemScheme

  const onHuesChange = useIdleCallback(
    useCallback((tone: CardTone, hue: Hue) => {
      setHuesState((prev) => ({ ...prev, [tone]: hue }))
    }, []),
    { requestTransition: spin, startTransition }
  )
  const onChangePreset = useIdleCallback(
    useCallback((nextPreset: ThemePreset) => setPreset(nextPreset), []),
    { requestTransition: spin, startTransition }
  )

  return (
    <ThemeProvider theme={themeFromHues} scheme={scheme}>
      <Head presetUrl={preset.url} />
      <Card
        height="fill"
        tone="transparent"
        style={{ ['color-scheme' as any]: scheme }}
      >
        <StyledGrid
          columns={[1, 1]}
          height="stretch"
          // @ts-expect-error
          sidebarWidth={sidebarWidth}
        >
          <ToastProvider paddingY={7} zOffset={Z_OFFSET.toast}>
            <LayerProvider>
              <Sidebar height="fill" overflow="auto" scheme={scheme}>
                <HeaderCard
                  scheme={scheme}
                  spins={spins}
                  transition={transition}
                />
                <Card borderRight height="fill" tone="default">
                  <Grid
                    columns={[2]}
                    paddingBottom={2}
                    style={{ paddingLeft: 'env(safe-area-inset-left)' }}
                  >
                    <Card paddingLeft={[4]} paddingTop={4}>
                      <SchemeMenu
                        forceScheme={forceScheme}
                        setForceScheme={setForceScheme}
                        startTransition={startTransition}
                      />
                    </Card>
                    <Card paddingTop={[4]}>
                      <ToggleView toggleView={toggleView} view={view} />
                    </Card>
                  </Grid>
                  <PresetsMenu
                    hues={memoHues}
                    selected={preset}
                    prepareTransition={spin}
                    startTransition={startTransition}
                    setPreset={setPreset}
                    onChange={onChangePreset}
                    unstable_showParsedUrl={unstable_showParsedUrl}
                  />
                  <Card height="fill" paddingY={1}>
                    <HuesFields
                      initialHues={initialHues}
                      startTransition={startTransition}
                      prepareTransition={spin}
                      onChange={onHuesChange}
                    />
                  </Card>
                </Card>
              </Sidebar>
            </LayerProvider>
          </ToastProvider>
          <StudioViewer
            config={config}
            scheme={scheme}
            sidebarWidth={sidebarWidth}
            theme={themeFromHues}
            unstable_noAuthBoundary={unstable_noAuthBoundary}
            view={view}
          />
        </StyledGrid>
      </Card>
    </ThemeProvider>
  )
}
