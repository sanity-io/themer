import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // The app imports its own modules relative to its root, like `utils/presets`
    // (`baseUrl` in tsconfig.json)
    alias: [
      {
        find: /^(components|edge-utils|hooks|studios|utils)\//,
        replacement: `${import.meta.dirname}/$1/`,
      },
    ],
  },
  test: {
    // The `/api/*` routes that use these utils run on the Edge runtime
    environment: 'edge-runtime',
    include: ['utils/**/*.test.ts'],
  },
})
