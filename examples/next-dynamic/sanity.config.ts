import { createConfig, defaultTheme } from 'sanity'
import { deskTool } from 'sanity/desk'
import { muxInput } from 'sanity-plugin-mux-input'

import { schemaTypes } from './schemas'

export default createConfig({
  // allows reading the default theme variables while the custom theme is loading
  theme: defaultTheme,

  title: 'Next Dynamic Import Example',
  projectId: 'c8jibo38',
  dataset: 'themer-movies',
  plugins: [deskTool(), muxInput({ mp4_support: 'standard' })],
  schema: { types: schemaTypes },
})
