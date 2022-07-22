import { Box, Card, Stack, Text, Tooltip, useToast } from '@sanity/ui'
import { memo } from 'react'
import styled from 'styled-components'
import { createTintsFromHue } from 'utils/createTonesFromHues'
import type { Hue } from 'utils/types'

interface Props extends Hue {
  tone: string
}
function ColorTintsPreview({ mid, midPoint, lightest, darkest, tone }: Props) {
  const { push: pushToast } = useToast()
  const tints = createTintsFromHue({ mid, midPoint, lightest, darkest }, tone)
  return (
    <>
      {Object.entries(tints).map(([tint, color]) => (
        <Tooltip
          key={tint}
          content={
            <Card key={tint} radius={2}>
              <SwatchPreview style={{ background: color.hex }} />
              <Stack space={2} padding={2}>
                <Text size={0} weight="medium">
                  {tint}
                </Text>
                <Text size={0} muted>
                  {color.hex}
                </Text>
              </Stack>
            </Card>
          }
          fallbackPlacements={['top-end', 'top-start']}
          placement="top"
          portal
        >
          <SwatchThumb
            style={{ background: color.hex }}
            onClick={() => {
              navigator.clipboard.writeText(color.hex)
              pushToast({
                closable: true,
                status: 'success',
                title: `Copied ${color.title} to the clipboard`,
              })
            }}
          />
        </Tooltip>
      ))}
    </>
  )
}

const SwatchPreview = styled(Box).attrs({ paddingTop: 3, paddingBottom: 4 })`
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  min-width: 52px;
`

// @TODO these should now be <Button> now that they have click events
const SwatchThumb = styled(Box).attrs({ paddingY: 2 })`
  cursor: pointer;
  box-shadow: var(--card-shadow-outline-color) -1px 0px 0 0;
`

export default memo(ColorTintsPreview)
