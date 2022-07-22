import { WarningOutlineIcon } from '@sanity/icons'
import { Box, Card, Grid, Skeleton, Stack, Text } from '@sanity/ui'
import { ImageColorPaletteGridSkeleton } from 'components/ImageColorPaletteGrid'
import { Label } from 'components/Sidebar.styles'
import { type ReactNode, memo } from 'react'
import styled from 'styled-components'

const ButtonSkeleton = styled(Skeleton).attrs({ radius: 2, animated: true })`
  /* Magic number, equals 25px, the height of the variant buttons */
  padding-top: 1.563rem;
`

interface PaletteVariantsLayoutProps {
  paletteLabel: ReactNode
  paletteGrid: ReactNode
  label: ReactNode
  children: ReactNode
}
export const PaletteVariantsLayout = memo(function PaletteVariantsLayout({
  paletteLabel,
  paletteGrid,
  label,
  children,
}: PaletteVariantsLayoutProps) {
  return (
    <>
      <Stack space={2}>
        {paletteLabel}
        <Box paddingRight={7}>{paletteGrid}</Box>
      </Stack>
      <Stack space={2}>
        {label}
        <Grid columns={2} gap={1}>
          {children}
        </Grid>
      </Stack>
    </>
  )
})

export const SuspenseFallback = () => (
  <PaletteVariantsLayout
    paletteLabel={<Label muted>Image Color Palette</Label>}
    paletteGrid={<ImageColorPaletteGridSkeleton />}
    label={<Label muted>Loading variants...</Label>}
  >
    <ButtonSkeleton style={{ gridColumn: '1 / 3' }} />
    <ButtonSkeleton />
    <ButtonSkeleton />
    <ButtonSkeleton />
    <ButtonSkeleton />
    <ButtonSkeleton />
    <ButtonSkeleton />
  </PaletteVariantsLayout>
)

export const WarningMessage = ({ message }: { message: string }) => (
  <Card tone="caution">
    <Grid
      paddingX={1}
      paddingY={3}
      columns={2}
      style={{ alignItems: 'center', gridTemplateColumns: '22px 1fr' }}
    >
      <WarningOutlineIcon />
      <Text size={0} style={{ wordBreak: 'break-word' }}>
        {message}
      </Text>
    </Grid>
  </Card>
)
