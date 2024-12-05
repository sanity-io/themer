import { defineConfig } from 'sanity'
import { muxInput } from 'sanity-plugin-mux-input'
import { structureTool } from 'sanity/structure'

import { schemaTypes } from './schemas'
import { themerTool } from './src'

const projectId = 'c8jibo38'
const dataset = 'themer-movies'

export default defineConfig({
  projectId,
  dataset,
  plugins: [structureTool(), muxInput(), themerTool()],
  schema: { types: schemaTypes },
})
