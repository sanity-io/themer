import {Box} from '@sanity/ui'
import {ToastProvider} from '@sanity/ui/toast'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, waitFor, within} from 'storybook/test'

import {MockThemerStudio} from './MockStudio'

/** Where the tool keeps its draft (see `packages/themer-legacy/src/tool/storage.ts`) */
const DRAFT_STORAGE_KEY = 'sanityStudio:themer-legacy:hues'

const meta: Meta<typeof MockThemerStudio> = {
  component: MockThemerStudio,
  // Every story starts out previewing the theme the Studio is configured with
  beforeEach: () => localStorage.removeItem(DRAFT_STORAGE_KEY),
  decorators: [
    (Story) => (
      <ToastProvider>
        <Box style={{height: '100vh'}}>
          <Story />
        </Box>
      </ToastProvider>
    ),
  ],
  parameters: {padding: 0},
}

export default meta
type Story = StoryObj<typeof MockThemerStudio>

export const Default: Story = {}

/** Open the sidebar, apply a preset, compare light and dark, then reset the draft */
export const EditDraft: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', {name: 'Themer (Legacy)'}))
    await expect(await canvas.findByRole('button', {name: 'Reset'})).toBeDisabled()

    await userEvent.click(canvas.getByRole('button', {name: 'Verdant'}))
    await waitFor(() => expect(canvas.getByRole('button', {name: 'Reset'})).toBeEnabled())

    await userEvent.click(canvas.getByRole('button', {name: 'Split-screen'}))
    // Each copy of the Studio renders its own navbar, toggle included
    await waitFor(() =>
      expect(canvas.getAllByRole('button', {name: 'Themer (Legacy)'})).toHaveLength(2),
    )

    await userEvent.click(canvas.getByRole('button', {name: 'Reset'}))
    await waitFor(() => expect(canvas.getByRole('button', {name: 'Reset'})).toBeDisabled())
  },
}
