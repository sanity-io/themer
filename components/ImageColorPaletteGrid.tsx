import { Box, Grid, Skeleton } from '@sanity/ui'
import { type ReactNode, memo } from 'react'
import styled from 'styled-components'

interface Props {
  image: ReactNode
  muted: ReactNode
  lightMuted: ReactNode
  darkMuted: ReactNode
  vibrant: ReactNode
  lightVibrant: ReactNode
  darkVibrant: ReactNode
}
function ImageColorPaletteGrid({
  image,
  muted,
  lightMuted,
  darkMuted,
  vibrant,
  lightVibrant,
  darkVibrant,
}: Props) {
  return (
    <Grid columns={5} rows={2} gap={1}>
      <ImageBox>{image}</ImageBox>
      {muted}
      {lightMuted}
      {darkMuted}
      {vibrant}
      {lightVibrant}
      {darkVibrant}
    </Grid>
  )
}

const ImageBox = styled(Box)`
  grid-column: 1 / 3;
  grid-row: 1 / 3;
  aspect-ratio: 1 / 1;
`

export default memo(ImageColorPaletteGrid)

const ColorSkeleton = styled(Skeleton).attrs({ animated: true, radius: 1 })``
export const ImageColorPaletteGridSkeleton = () => (
  <ImageColorPaletteGrid
    image={<Skeleton animated radius={1} height="fill" />}
    muted={<ColorSkeleton />}
    lightMuted={<ColorSkeleton />}
    darkMuted={<ColorSkeleton />}
    vibrant={<ColorSkeleton />}
    lightVibrant={<ColorSkeleton />}
    darkVibrant={<ColorSkeleton />}
  />
)
