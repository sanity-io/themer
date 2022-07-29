import {
  createTheme,
  hues,
} from 'https://themer.sanity.build/api/hues?preset=pink-synth'
import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { muxInput } from 'sanity-plugin-mux-input'

import { schemaTypes } from './schemas'

export default createConfig({
  theme: createTheme({
    ...hues,
    default: { ...hues.default, lightest: '#ece3e9' },
  }),

  name: 'next-static',
  title: 'Next Static Import Example',
  projectId: 'c8jibo38',
  dataset: 'themer-movies',
  plugins: [deskTool(), muxInput()],
  schema: { types: schemaTypes },
})
