import { Button as UiButton, Text } from '@sanity/ui'
import { transparentize } from 'polished'
import styled from 'styled-components'

export const Button = styled(UiButton).attrs({
  fontSize: 1,
  paddingY: 2,
  paddingX: 3,
})``

export const Label = styled(Text).attrs({ size: 0, weight: 'semibold' })``

export const ColorInput = styled.input.attrs({ type: 'color' })`
  cursor: pointer;
  box-sizing: border-box;
  background: var(--card-border-color);
  border: 0 solid transparent;
  border-radius: 2px;
  padding: 0;
  appearance: none;
  margin: 0;
  height: 1.6rem;
  width: 8ch;

  &:hover {
    box-shadow: 0 0 0 2px
      ${({ theme }) => theme.sanity.color.card.hovered.border};
  }

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    padding: 0;
    border: 0 solid transparent;
    border-radius: 2px;
    box-shadow: inset 0 0 0 1px
      ${({ theme }) => transparentize(0.8, theme.sanity.color.card.enabled.fg)};
  }

  &::-moz-color-swatch {
    padding: 0;
    border: 0 solid transparent;
    border-radius: 2px;
    box-shadow: inset 0 0 0 1px
      ${({ theme }) => transparentize(0.8, theme.sanity.color.card.enabled.fg)};
  }
`

export const RangeInput = styled.input.attrs({ type: 'range' })`
  accent-color: var(--card-focus-ring-color, currentColor);
  width: 100%;

  &::-webkit-slider-runnable-track {
    border-color: var(--card-focus-ring-color, currentColor);
  }
  &[type='range']::-webkit-slider-thumb {
    border-color: var(--card-focus-ring-color, currentColor);
    background-color: var(--card-focus-ring-color, currentColor);
  }
`
