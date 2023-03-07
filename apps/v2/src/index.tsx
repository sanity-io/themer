import { SelectIcon } from '@sanity/icons'
import {
  Button,
  Card,
  Grid,
  Label,
  Menu,
  MenuButton,
  MenuItem,
  ThemeProvider,
} from '@sanity/ui'
import { theme as dew } from 'https://themer.sanity.build/api/hues?preset=dew'
import { theme as pinkSynthTheme } from 'https://themer.sanity.build/api/hues?preset=pink-synth'
import { theme as pixelart } from 'https://themer.sanity.build/api/hues?preset=pixelart'
import { theme as retrocolonial } from 'https://themer.sanity.build/api/hues?preset=retrocolonial'
import { theme as rosabel } from 'https://themer.sanity.build/api/hues?preset=rosabel'
import { theme as stereofidelic } from 'https://themer.sanity.build/api/hues?preset=stereofidelic'
import { theme as twCyan } from 'https://themer.sanity.build/api/hues?preset=tw-cyan'
import { theme as verdant } from 'https://themer.sanity.build/api/hues?preset=verdant'
import { useState, useTransition } from 'react'
import { defaultTheme, definePlugin, type StudioTheme } from 'sanity'
import styled from 'styled-components'

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

function Layout({
  children,
  sidebarWidth,
}: { children: React.ReactNode } & ThemerToolConfig) {
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState(presets[0])

  return (
    <ThemeProvider theme={selected.theme}>
      <Card height="fill" tone="transparent">
        <StyledGrid
          columns={[1, 1]}
          height="stretch"
          sidebarWidth={sidebarWidth}
        >
          <Card paddingX={[4]} paddingBottom={2}>
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
                                  startTransition(() => setSelected(_preset))
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
          {children}
        </StyledGrid>
      </Card>
    </ThemeProvider>
  )
}
