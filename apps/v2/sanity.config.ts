import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { muxInput } from 'sanity-plugin-mux-input'

import { schemaTypes } from './schemas'
import { themerTool } from './src'

const projectId = 'c8jibo38'
const dataset = 'themer-movies'

export default defineConfig({
  projectId,
  dataset,
  title: 'Themer v2',
  plugins: [deskTool(), muxInput(), themerTool()],
  schema: { types: schemaTypes },
})
