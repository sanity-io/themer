import {createConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
//import {googleMapsInput} from '@sanity/google-maps-input'
import {schemaTypes} from './schemas'

export default createConfig({
  name: 'default',
  title: 'Structured Layout',

  projectId: 'c8jibo38',
  dataset: 'themer-movies',

  plugins: [
    deskTool(),
    //googleMapsInput(),
  ],

  schema: {
    types: schemaTypes,
  },
})
