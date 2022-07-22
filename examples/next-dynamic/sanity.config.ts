import { createConfig, defaultTheme } from 'sanity'
import { deskTool } from 'sanity/desk'

import { schemaTypes } from './schemas'

export default createConfig({
  // allows reading the default theme variables while the custom theme is loading
  theme: defaultTheme,

  name: 'next-dynamic',
  title: 'Next Dynamic Import Example',
  projectId: 'c8jibo38',
  dataset: 'themer-movies',
  plugins: [deskTool()],
  schema: { types: schemaTypes },
})
