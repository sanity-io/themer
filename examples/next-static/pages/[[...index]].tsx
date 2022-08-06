import { StudioPageLayout } from '@sanity/next-studio-layout'

import config from '../sanity.config'

export default function IndexPage() {
  return <StudioPageLayout config={config} />
}
