import type {LegacyTheme} from '@sanity/themer-legacy'
import {
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Stack,
  Text,
  TextInput,
  ThemeProvider,
} from '@sanity/ui'

/** The six hues a legacy theme is generated from, as card tones */
const CARD_TONES = ['default', 'primary', 'transparent', 'positive', 'caution', 'critical'] as const

/** Buttons and badges have no `transparent` tone */
const STATE_TONES = ['default', 'primary', 'positive', 'caution', 'critical'] as const

const capitalize: React.CSSProperties = {textTransform: 'capitalize'}

/** A sample of `@sanity/ui` components, in whatever theme surrounds them */
function ThemeSample(props: {title?: string}) {
  const {title} = props

  return (
    <Stack gap={4}>
      {title && (
        <Heading as="h2" size={1}>
          {title}
        </Heading>
      )}

      <Flex gap={2} wrap="wrap">
        {STATE_TONES.map((tone) => (
          <Button key={tone} style={capitalize} text={tone} tone={tone} />
        ))}
      </Flex>

      <Flex gap={2} wrap="wrap">
        {STATE_TONES.map((tone) => (
          <Button key={tone} mode="ghost" style={capitalize} text={tone} tone={tone} />
        ))}
      </Flex>

      <Flex gap={2} wrap="wrap">
        {STATE_TONES.map((tone) => (
          <Badge key={tone} style={capitalize} tone={tone}>
            {tone}
          </Badge>
        ))}
      </Flex>

      <TextInput aria-label="Text input" placeholder="Text input" />

      <Grid gap={3} gridTemplateColumns={[1, 2, 3]}>
        {CARD_TONES.map((tone) => (
          <Card border key={tone} padding={3} radius={2} tone={tone}>
            <Stack gap={3}>
              <Text size={1} style={capitalize} weight="semibold">
                {tone}
              </Text>
              <Text muted size={1}>
                Muted text on a {tone} card
              </Text>
            </Stack>
          </Card>
        ))}
      </Grid>
    </Stack>
  )
}

/**
 * The component sample under a generated theme. The scheme is inherited from
 * the surrounding `ThemeProvider`, like a Studio configured with the theme
 * follows its appearance setting.
 */
export function ThemePreview(props: {theme: LegacyTheme; title?: string}) {
  const {theme, title} = props

  return (
    <ThemeProvider theme={theme}>
      <Card border padding={4} radius={3}>
        <ThemeSample title={title} />
      </Card>
    </ThemeProvider>
  )
}
