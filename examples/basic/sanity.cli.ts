import { createCliConfig } from 'sanity/cli'
import type { UserConfig } from 'vite'

const projectId = process.env.SANITY_STUDIO_API_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_API_DATASET

export default createCliConfig({
  api: { projectId, dataset },
  vite: (config: UserConfig): UserConfig => ({
    ...config,
    // Target needs to be es2022 to enable top-level await
    // https://esbuild.github.io/content-types/#javascript:~:text=123n-,Top%2Dlevel%20await,-es2022
    build: { ...config.build, target: 'es2022' },
  }),
})
