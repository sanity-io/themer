import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import { schemaTypes } from './schemas'

console.time('await theme')
const { createTheme, hues } = await import(
  'https://themer.sanity.build/api/hues?default=975e86&primary=2c6ebd&transparent=975e86&positive=43d675;300&caution=fbd024;200&lightest=fdfcfd&darkest=150d13'
)
console.timeEnd('await theme')
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

console.log(theme)

export default createConfig({
  theme,

  name: 'advanced',
  title: 'Advanced Example',
  projectId: 'c8jibo38',
  dataset: 'themer-movies',
  plugins: [deskTool()],
  schema: { types: schemaTypes },
})
