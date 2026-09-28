import {Box, Card, Flex, Text} from '@sanity/ui'
import {type ComponentProps, Fragment} from 'react'

import {ThemerLayout} from '../../../../packages/themer-legacy/src/tool/ThemerLayout'
import {ThemerNavbar} from '../../../../packages/themer-legacy/src/tool/ThemerNavbar'
import {ThemeSample} from '../theme/ThemePreview'

/** Renders the topbar actions of the navbar, where the tool adds its toggle */
function MockNavbar(props: ComponentProps<typeof ThemerNavbar>) {
  return (
    <Card borderBottom paddingX={3} paddingY={2}>
      <Flex align="center" gap={2}>
        <Box flex={1} paddingLeft={1}>
          <Text size={1} weight="semibold">
            Studio
          </Text>
        </Box>
        {props.__internal_actions?.map((action) =>
          action.location === 'topbar' && action.render ? (
            <Fragment key={action.name}>{action.render()}</Fragment>
          ) : null,
        )}
      </Flex>
    </Card>
  )
}

/** Stands in for the Studio the tool wraps: a navbar over some content */
function MockStudio() {
  return (
    <Flex direction="column" height="fill">
      <ThemerNavbar renderDefault={(props) => <MockNavbar {...props} />} />
      <Box flex={1} overflow="auto" padding={4}>
        <ThemeSample />
      </Box>
    </Flex>
  )
}

/**
 * The studio components that `themerTool()` registers — the layout that hosts
 * the sidebar and previews the draft, and the navbar with its toggle — around
 * a mock Studio instead of a real one.
 */
export function MockThemerStudio() {
  return <ThemerLayout renderDefault={() => <MockStudio />} />
}
