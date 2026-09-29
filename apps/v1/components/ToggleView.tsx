import { CollapseIcon, SplitVerticalIcon } from '@sanity/icons'
import { Button, Card, Label } from '@sanity/ui'
import type { View } from 'components/StudioViewer'
import { memo } from 'react'

interface Props {
  toggleView: () => void
  view: View
}
const ToggleView = ({ toggleView, view }: Props) => {
  return (
    <>
      <Label htmlFor="view" size={0} muted>
        View
      </Label>
      <Card paddingY={2}>
        <Button
          fontSize={1}
          paddingY={2}
          paddingX={3}
          tone="default"
          mode="ghost"
          icon={view === 'default' ? SplitVerticalIcon : CollapseIcon}
          text={view === 'default' ? 'Split-screen' : 'Collapse'}
          onClick={toggleView}
        />
      </Card>
    </>
  )
}

export default memo(ToggleView)
