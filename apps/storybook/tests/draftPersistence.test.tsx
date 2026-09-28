import {composeStories} from '@storybook/react-vite'
import {beforeEach, describe, expect, test} from 'vitest'
import {render} from 'vitest-browser-react'
import {userEvent} from 'vitest/browser'

import * as themerStories from '../stories/tool/Themer.stories'

const {Default} = composeStories(themerStories)

// Remounting the tool stands in for reloading the Studio, which a story `play`
// function can't do
describe('tool/Themer', () => {
  beforeEach(() => localStorage.clear())

  test('keeps the draft across reloads', async () => {
    const first = await render(<Default />)
    await userEvent.click(first.getByRole('button', {name: 'Themer (Legacy)'}))
    await userEvent.click(first.getByRole('button', {name: 'Verdant'}))
    await expect.element(first.getByRole('button', {name: 'Reset'})).toBeEnabled()
    await first.unmount()

    const second = await render(<Default />)
    await userEvent.click(second.getByRole('button', {name: 'Themer (Legacy)'}))
    await expect.element(second.getByRole('button', {name: 'Reset'})).toBeEnabled()
  })

  test('forgets the draft once it is reset', async () => {
    const first = await render(<Default />)
    await userEvent.click(first.getByRole('button', {name: 'Themer (Legacy)'}))
    await userEvent.click(first.getByRole('button', {name: 'Verdant'}))
    await userEvent.click(first.getByRole('button', {name: 'Reset'}))
    await expect.element(first.getByRole('button', {name: 'Reset'})).toBeDisabled()
    await first.unmount()

    const second = await render(<Default />)
    await userEvent.click(second.getByRole('button', {name: 'Themer (Legacy)'}))
    await expect.element(second.getByRole('button', {name: 'Reset'})).toBeDisabled()
  })
})
