import config from '../sanity.config'
import { Studio } from 'sanity'

export default function IndexPage() {
  return <Studio config={config} />
}
