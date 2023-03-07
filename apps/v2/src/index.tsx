import { SelectIcon } from '@sanity/icons'
import {
  Button,
  Card,
  Grid,
  Label,
  Menu,
  MenuButton,
  MenuItem,
  Text,
  type ThemeColorSchemeKey,
  ThemeProvider,
} from '@sanity/ui'
import { theme as dew } from 'https://themer.sanity.build/api/hues?preset=dew'
import { theme as pinkSynthTheme } from 'https://themer.sanity.build/api/hues?preset=pink-synth'
import { theme as pixelart } from 'https://themer.sanity.build/api/hues?preset=pixel-art'
import { theme as retrocolonial } from 'https://themer.sanity.build/api/hues?preset=retro-colonial'
import { theme as rosabel } from 'https://themer.sanity.build/api/hues?preset=rosabel'
import { theme as stereofidelic } from 'https://themer.sanity.build/api/hues?preset=stereofidelic'
import { theme as twCyan } from 'https://themer.sanity.build/api/hues?preset=tw-cyan'
import { theme as verdant } from 'https://themer.sanity.build/api/hues?preset=verdant'
import {
  memo,
  type TransitionStartFunction,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  useTransition,
} from 'react'
import {
  defaultTheme,
  definePlugin,
  useColorScheme,
  type StudioTheme,
} from 'sanity'
import styled from 'styled-components'

import Logo from './Logo'

type Preset = { slug: string; title: string; theme: StudioTheme }
const presets = [
  { slug: 'default', title: 'Studio v3', theme: defaultTheme },
  { slug: 'dew', title: 'Dew', theme: dew },
  { slug: 'pink-synth', title: 'Pink Synth', theme: pinkSynthTheme },
  { slug: 'pixel-art', title: 'Pixel Art', theme: pixelart },
  { slug: 'retro-colonial', title: 'Retro Colonial', theme: retrocolonial },
  { slug: 'rosabel', title: 'Rosabel', theme: rosabel },
  { slug: 'stereofidelic', title: 'Stereofidelic', theme: stereofidelic },
  { slug: 'tw-cyan', title: 'Tailwind Cyan', theme: twCyan },
  { slug: 'verdant', title: 'Verdant', theme: verdant },
] satisfies Preset[]

export interface ThemerToolConfig {
  /**
   * @defaultValue 300
   */
  sidebarWidth?: number
}

export const themerTool = definePlugin<ThemerToolConfig | void>((options) => {
  const { sidebarWidth = 300, ...config } = options || {}
  return {
    name: '@sanity/themer',
    studio: {
      components: {
        layout: (props) => {
          console.log('layout', props)

          return (
            <Layout sidebarWidth={sidebarWidth}>
              {props.renderDefault(props)}
            </Layout>
          )
        },
      },
    },
  }
})

// @TODO read the media query from the theme context instead of hardcoding to 600px
const StyledGrid = styled<any>(Grid)`
  row-gap: 1px;
  @media screen and (min-width: 600px) {
    && {
      grid-template-columns: ${({ sidebarWidth }: any) => sidebarWidth}px 1fr;
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

const noop = () => {
  return () => {}
}
const localKey = 'themer:preset'

function Layout({
  children,
  sidebarWidth,
}: { children: React.ReactNode } & ThemerToolConfig) {
  const [isPending, startTransition] = useTransition()
  const initialSlug = useSyncExternalStore(
    noop,
    () => localStorage.getItem(localKey),
    () => presets[0].slug
  )
  const [selected, setSelected] = useState(
    () => presets.find((preset) => preset.slug === initialSlug) || presets[0]
  )

  useEffect(() => {
    localStorage.setItem(localKey, selected.slug)
  }, [selected.slug])

  return (
    <ThemeProvider theme={selected.theme}>
      <Card height="fill" tone="transparent">
        <StyledGrid
          columns={[1, 1]}
          height="stretch"
          sidebarWidth={sidebarWidth}
        >
          <Sidebar height="fill" overflow="auto">
            <HeaderCard spins={isPending ? 0 : 1} transition={isPending} />
            <Card borderRight height="fill" tone="default">
              <Card paddingX={[4]} paddingBottom={2} paddingTop={4}>
                <Label htmlFor="presets" size={0} muted>
                  Presets
                </Label>
                <Card paddingY={2}>
                  <MenuButton
                    button={
                      <Button
                        loading={isPending}
                        fontSize={1}
                        paddingY={2}
                        paddingX={3}
                        tone="default"
                        mode="ghost"
                        iconRight={SelectIcon}
                        text={selected.title}
                      />
                    }
                    id="presets"
                    menu={
                      <Menu>
                        {presets.map((_preset) => {
                          const { slug, title } = _preset
                          const active = selected.slug === slug
                          return (
                            <MenuItem
                              fontSize={1}
                              paddingY={2}
                              paddingX={3}
                              key={slug}
                              text={title}
                              tone={active ? 'primary' : 'default'}
                              selected={active}
                              onClick={
                                active
                                  ? undefined
                                  : () =>
                                      startTransition(() =>
                                        setSelected(_preset)
                                      )
                              }
                            />
                          )
                        })}
                      </Menu>
                    }
                    placement="bottom-start"
                    popover={{ portal: true }}
                  />
                </Card>
              </Card>
            </Card>
          </Sidebar>
          {children}
        </StyledGrid>
      </Card>
    </ThemeProvider>
  )
}

interface Props {
  spins: number
  transition: boolean
}
export const HeaderCard = memo(function HeaderCard({
  spins,
  transition,
}: Props) {
  const { scheme } = useColorScheme()
  return (
    <RootCard
      paddingLeft={[4]}
      paddingY={[2]}
      scheme="dark"
      shadow={scheme === 'dark' ? 1 : undefined}
    >
      <Card
        borderRight
        style={{
          display: 'grid',
          gridTemplateColumns: '32px 1fr',
          alignItems: 'center',
          paddingLeft: 'env(safe-area-inset-left)',
        }}
      >
        <Logo spin={spins} transition={transition} />
        <Card paddingY={[3]} paddingX={[3]}>
          <Text weight="semibold" muted style={{ flex: 2 }}>
            Themer
          </Text>
        </Card>
      </Card>
    </RootCard>
  )
})

interface UseHeaderCard {
  spin: () => void
  spins: number
  transition: boolean
  startTransition: TransitionStartFunction
}
export const useHeaderCard = (): UseHeaderCard => {
  const [transition, startTransition] = useTransition()
  const [spins, setSpin] = useState(1)
  const spin = useCallback(
    () => startTransition(() => setSpin((spins) => ++spins)),
    []
  )

  return {
    spins,
    spin,
    transition,
    startTransition,
  }
}

// @TODO find a better z-index than 101
const RootCard = styled(Card)`
  position: sticky;
  top: 0;
  z-index: 101;
`
