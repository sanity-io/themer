import {buildThemeFromUrl, type LegacyTheme} from '@sanity/themer-legacy'
import {Card, Text} from '@sanity/ui'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'

import {ThemePreview} from './ThemePreview'

interface BuildThemeFromUrlArgs {
  url: string
}

function tryBuildThemeFromUrl(url: string): {theme: LegacyTheme} | {error: string} {
  try {
    return {theme: buildThemeFromUrl(url)}
  } catch (error) {
    return {error: error instanceof Error ? error.message : String(error)}
  }
}

const meta: Meta<BuildThemeFromUrlArgs> = {
  args: {url: 'https://themer.sanity.build/api/hues?preset=verdant&primary=22fca8'},
  render: (args) => {
    const result = tryBuildThemeFromUrl(args.url)

    if ('error' in result) {
      return (
        <Card padding={3} radius={2} tone="critical">
          <Text size={1}>{result.error}</Text>
        </Card>
      )
    }

    return <ThemePreview theme={result.theme} title={args.url} />
  },
}

export default meta
type Story = StoryObj<BuildThemeFromUrlArgs>

/** The theme a `https://themer.sanity.build/api/hues` URL import used to serve */
export const Default: Story = {}

/** URLs the hosted service rejected throw the same errors */
export const InvalidUrl: Story = {
  args: {url: 'https://themer.sanity.build/api/hues?primary=nothex'},
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)

    await expect(
      await canvas.findByText('Invalid param for the primary hue: nothex'),
    ).toBeInTheDocument()
  },
}
