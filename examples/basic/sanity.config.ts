import { theme } from 'https://themer.sanity.build/api/hues?preset=verdant'
import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { muxInput } from 'sanity-plugin-mux-input'
import { schemaTypes } from './schemas'

const projectId = import.meta.env.SANITY_STUDIO_API_PROJECT_ID
const dataset = import.meta.env.SANITY_STUDIO_API_DATASET

export default createConfig({
  projectId,
  dataset,
  theme,
  title: 'Basic Example',
  plugins: [deskTool(), muxInput()],
  schema: { types: schemaTypes },
})
