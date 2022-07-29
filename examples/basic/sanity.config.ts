import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { muxInput } from 'sanity-plugin-mux-input'

import { schemaTypes } from './schemas'

const { theme } = (await import(
  // @ts-expect-error -- TODO setup themer.d.ts to get correct typings
  'https://themer.sanity.build/api/hues?preset=verdant'
)) as { theme: import('sanity').StudioTheme }

export default createConfig({
  theme,

  name: 'basic',
  title: 'Basic Example',
  projectId: 'c8jibo38',
  dataset: 'themer-movies',
  plugins: [deskTool(), muxInput()],
  schema: { types: schemaTypes },
})
