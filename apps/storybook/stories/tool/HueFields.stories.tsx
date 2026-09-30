import {type Hue, hues, type Hues} from '@sanity/themer-legacy'
import {Box} from '@sanity/ui'
import {ToastProvider} from '@sanity/ui/toast'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, fireEvent, userEvent, waitFor, within} from 'storybook/test'

import {HueFields} from '../../../../packages/themer-legacy/src/tool/HueFields'
import {HUE_KEYS} from '../../../../packages/themer-legacy/src/tool/hues'

interface HueFieldsArgs {
  tone: keyof Hues
}

/** The editor for one hue of the default preset, keeping its edits like the sidebar does */
function HueFieldsStory(props: HueFieldsArgs) {
  const {tone} = props
  const [hue, setHue] = useState<Hue>(hues[tone])

  return (
    <HueFields
      hue={hue}
      onChange={(_tone, changes) => setHue((current) => ({...current, ...changes}))}
      tone={tone}
    />
  )
}

const meta: Meta<HueFieldsArgs> = {
  args: {tone: 'primary'},
  argTypes: {tone: {control: 'select', options: HUE_KEYS}},
  decorators: [
    (Story) => (
      <ToastProvider>
        {/* As wide as the themer sidebar */}
        <Box style={{width: 300}}>
          <Story />
        </Box>
      </ToastProvider>
    ),
  ],
  // Remounts when the tone changes, so the editor starts from that tone's hue
  render: (args) => <HueFieldsStory key={args.tone} tone={args.tone} />,
}

export default meta
type Story = StoryObj<HueFieldsArgs>

export const Default: Story = {}

/** Pick a mid color, then move it one tint up the ramp with the keyboard */
export const EditHue: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)

    await fireEvent.change(canvas.getByLabelText('Mid'), {target: {value: '#ff0000'}})
    await expect(await canvas.findByText('#ff0000')).toBeInTheDocument()

    canvas.getByLabelText(/^Mid point/).focus()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(canvas.getByText('Mid point (600)')).toBeInTheDocument())
  },
}
