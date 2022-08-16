import { createConfig, defaultTheme } from 'sanity'
import { deskTool } from 'sanity/desk'
import { muxInput } from 'sanity-plugin-mux-input'

import { schemaTypes } from './schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default createConfig({
  projectId,
  dataset,
  // allows reading the default theme variables while the custom theme is loading
  theme: defaultTheme,
  title: 'Next Dynamic Import Example',
  plugins: [deskTool(), muxInput({ mp4_support: 'standard' })],
  schema: { types: schemaTypes },
})
