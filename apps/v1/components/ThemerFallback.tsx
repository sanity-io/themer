import {
  Card,
  Flex,
  Spinner,
  studioTheme,
  Text,
  ThemeProvider,
} from '@sanity/ui'
import Head from 'components/Head'
import { memo } from 'react'
import { defaultPreset } from 'utils/presets'

const ThemerFallback = () => (
  <ThemeProvider scheme="light" theme={studioTheme}>
    <Head presetUrl={defaultPreset.url} />
    <Card height="fill" tone="transparent">
      <Flex
        align="center"
        direction="column"
        gap={4}
        justify="center"
        padding={6}
        sizing="border"
        height="fill"
      >
        <Text muted>Loading…</Text>
        <Spinner muted />
      </Flex>
    </Card>
  </ThemeProvider>
)

export default memo(ThemerFallback)
