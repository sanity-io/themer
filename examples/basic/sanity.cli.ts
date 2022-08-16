import { createCliConfig } from 'sanity/cli'
import type { UserConfig } from 'vite'
import topLevelAwait from 'vite-plugin-top-level-await'

const projectId = process.env.SANITY_STUDIO_API_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_API_DATASET

export default createCliConfig({
  api: { projectId, dataset },
  vite: (config: UserConfig): UserConfig => ({
    ...config,
    plugins: [topLevelAwait(), ...(config.plugins || [])],
  }),
})
