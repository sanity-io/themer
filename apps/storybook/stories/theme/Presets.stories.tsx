import {createTheme, presets} from '@sanity/themer-legacy'
import {Stack} from '@sanity/ui'
import type {Meta, StoryObj} from '@storybook/react-vite'

import {ThemePreview} from './ThemePreview'

interface PresetsArgs {
  preset: string
}

const meta: Meta<PresetsArgs> = {
  args: {preset: 'default'},
  argTypes: {
    preset: {control: 'select', options: presets.map((preset) => preset.slug)},
  },
}

export default meta
type Story = StoryObj<PresetsArgs>

/** A preset of the hosted Themer, generated with `createTheme(preset.hues)` */
export const Default: Story = {
  render: (args) => {
    const preset = presets.find((candidate) => candidate.slug === args.preset) ?? presets[0]

    return <ThemePreview theme={createTheme(preset.hues)} title={preset.title} />
  },
}

/** Every preset of the hosted Themer */
export const All: Story = {
  parameters: {controls: {include: []}},
  render: () => (
    <Stack gap={4}>
      {presets.map((preset) => (
        <ThemePreview key={preset.slug} theme={createTheme(preset.hues)} title={preset.title} />
      ))}
    </Stack>
  ),
}
