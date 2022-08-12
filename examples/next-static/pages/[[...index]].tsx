import { NextStudio } from 'next-sanity/studio'

import config from '../sanity.config'

export default function IndexPage() {
  return <NextStudio config={config} />
}
