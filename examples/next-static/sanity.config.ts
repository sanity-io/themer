import {
  createTheme,
  hues,
} from 'https://themer.sanity.build/api/hues?preset=pink-synth'
import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { muxInput } from 'sanity-plugin-mux-input'

import { schemaTypes } from './schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default createConfig({
  projectId,
  dataset,
  theme: createTheme({
    ...hues,
    default: { ...hues.default, lightest: '#ece3e9' },
  }),
  title: 'Next Static Import Example',
  plugins: [deskTool(), muxInput()],
  schema: { types: schemaTypes },
})
