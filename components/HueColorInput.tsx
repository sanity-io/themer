import { Stack, Text } from '@sanity/ui'
import { ColorInput, Label } from 'components/Sidebar.styles'
import { type ChangeEventHandler, memo, useId } from 'react'
import styled from 'styled-components'

interface Props {
  label: string
  onChange: ChangeEventHandler<HTMLInputElement>
  // @TODO use TS template string types to make sure a valid hex string is given
  value: string
}
const HueColorInput = ({ label, onChange, value }: Props) => {
  const id = useId()

  return (
    <Stack space={2}>
      <label htmlFor={id}>
        <Label>{label}</Label>
      </label>
      <ColorInput id={id} value={value} onChange={onChange} />
      <output htmlFor={id}>
        <Text muted size={0}>
          {value}
        </Text>
      </output>
    </Stack>
  )
}

export default memo(HueColorInput)
