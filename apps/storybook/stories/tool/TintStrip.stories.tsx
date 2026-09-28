import {hues, type Hues} from '@sanity/themer-legacy'
import {Box} from '@sanity/ui'
import {ToastProvider} from '@sanity/ui/toast'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, spyOn, userEvent, within} from 'storybook/test'

import {HUE_KEYS} from '../../../../packages/themer-legacy/src/tool/hues'
import {TintStrip} from '../../../../packages/themer-legacy/src/tool/TintStrip'

interface TintStripArgs {
  tone: keyof Hues
}

const meta: Meta<TintStripArgs> = {
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
  render: (args) => <TintStrip hue={hues[args.tone]} title={args.tone} />,
}

export default meta
type Story = StoryObj<TintStripArgs>

export const Default: Story = {}

/** Clicking a tint copies its hex to the clipboard */
export const CopyTint: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const writeText = spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)

    const [swatch] = canvas.getAllByRole('button', {name: /^Copy /})
    const hex = swatch.getAttribute('aria-label')?.match(/#[\da-f]{6}/i)?.[0]
    await expect(hex).toBeDefined()

    await userEvent.click(swatch)
    await expect(writeText).toHaveBeenCalledWith(hex)
    await expect(
      await within(document.body).findByText(/^Copied .+ to the clipboard$/),
    ).toBeInTheDocument()
  },
}
