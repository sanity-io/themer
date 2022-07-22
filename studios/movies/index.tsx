import { BiMoviePlay } from 'react-icons/bi'
import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import { schemaTypes } from './schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_MOVIES_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_MOVIES_DATASET

export const config = createConfig({
  name: 'movies',
  title: 'Movies',
  basePath: '/movies',
  icon: BiMoviePlay,
  projectId,
  dataset,
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
})
