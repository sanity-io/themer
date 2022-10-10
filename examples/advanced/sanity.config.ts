import {
  createTheme,
  hues,
} from 'https://themer.sanity.build/api/hues?default=975e86&primary=2c6ebd&transparent=975e86&positive=43d675;300&caution=fbd024;200&lightest=fdfcfd&darkest=150d13'
import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { muxInput } from 'sanity-plugin-mux-input'

import { schemaTypes } from './schemas'

const projectId = import.meta.env.SANITY_STUDIO_API_PROJECT_ID
const dataset = import.meta.env.SANITY_STUDIO_API_DATASET

const theme = createTheme({
  ...hues,
  positive: { ...hues.positive, midPoint: 200 },
  critical: {
    mid: '#f43f5e',
    midPoint: 500,
    lightest: '#fef1f2',
    darkest: '#881337',
  },
})

export default createConfig({
  projectId,
  dataset,
  theme,
  title: 'Advanced Example',
  plugins: [deskTool(), muxInput({ mp4_support: 'standard' })],
  schema: { types: schemaTypes },
})
