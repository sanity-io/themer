import { createCliConfig } from 'sanity/cli'
import type { UserConfig } from 'vite'

export default createCliConfig({
  api: { projectId: 'c8jibo38', dataset: 'c8jibo38' },
  vite: (config: UserConfig): UserConfig => ({
    ...config,
    build: { ...config.build, target: 'esnext' },
  }),
})
