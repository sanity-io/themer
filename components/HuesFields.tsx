import { COLOR_TINTS } from '@sanity/color'
import { type CardTone, Card, Grid, Skeleton, Stack, Text } from '@sanity/ui'
import { Label, RangeInput } from 'components/Sidebar.styles'
import {
  type ChangeEventHandler,
  type TransitionStartFunction,
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'
import styled from 'styled-components'
import { TONES } from 'utils/colors'
import { isColor } from 'utils/parseHuesFromSearchParams'
import { roundMidPoint } from 'utils/roundMidPoint'
import type { Hue, Hues } from 'utils/types'

import HueColorInput from './HueColorInput'

const ColorTintsPreview = lazy(() => import('components/ColorTintsPreview'))

interface Props {
  // Needs to be stable or it'll reset
  initialHues: Hues
  onChange: (tone: CardTone, hue: Hue) => void
  startTransition: TransitionStartFunction
  prepareTransition: () => void
}
function HuesFields({
  initialHues,
  onChange,
  startTransition,
  prepareTransition,
}: Props) {
  return (
    <>
      {TONES.map((key) => {
        return (
          <HueFields
            key={key}
            initialHue={initialHues[key]}
            tone={key}
            onChange={onChange}
            startTransition={startTransition}
            prepareTransition={prepareTransition}
          />
        )
      })}
    </>
  )
}

export default memo(HuesFields)

const HueFields = memo(function HueFields({
  initialHue,
  tone,
  onChange,
  startTransition,
  prepareTransition,
}: {
  initialHue: Hue
  tone: CardTone
  onChange: (tone: CardTone, hue: Hue) => void
  startTransition: TransitionStartFunction
  prepareTransition: () => void
}) {
  // Fast state for intenral use, for inputs, range drags, the color picker etc
  const [lightest, setLightest] = useState<string>(() => initialHue.lightest)
  const [mid, setMid] = useState<string>(() => initialHue.mid)
  const [darkest, setDarkest] = useState<string>(() => initialHue.darkest)
  const [midPoint, setMidPoint] = useState<string>(
    () => `${initialHue.midPoint}`
  )
  const midPointRounded = useMemo<Hue['midPoint']>(
    () => roundMidPoint(Number(midPoint)),
    [midPoint]
  )

  // Correct state, uses a transition
  const [hue, setHue] = useState(() => initialHue)

  // Sync when another preset is loaded
  useEffect(() => {
    setHue(initialHue)
    setLightest(initialHue.lightest)
    setMid(initialHue.mid)
    setDarkest(initialHue.darkest)
    setMidPoint(`${initialHue.midPoint}`)
  }, [initialHue])

  // Sync with onChange, parent comp have to implement startTransition on their end
  useEffect(() => {
    onChange(tone, hue)
  }, [tone, hue, onChange])

  const midChangeHandler = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const { value } = event.target

      setMid(value)
      prepareTransition()
      startTransition(() => {
        if (isColor(value)) {
          setHue((hue) => ({ ...hue, mid: value }))
        }
      })
    },
    [prepareTransition, startTransition]
  )
  const lightestChangeHandler = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      const { value } = event.target

      setLightest(value)
      prepareTransition()
      startTransition(() => {
        if (isColor(value)) {
          setHue((hue) => ({ ...hue, lightest: value }))
        }
      })
    },
    [prepareTransition, startTransition]
  )
  const darkestChangeHandler = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      const { value } = event.target

      setDarkest(value)
      prepareTransition()
      startTransition(() => {
        if (isColor(value)) {
          setHue((hue) => ({ ...hue, darkest: value }))
        }
      })
    },
    [prepareTransition, startTransition]
  )

  useEffect(() => {
    prepareTransition()
    startTransition(() => {
      setHue((hue) => {
        if (hue.midPoint !== midPointRounded) {
          return { ...hue, midPoint: midPointRounded }
        }
        return hue
      })
    })
  }, [midPointRounded, prepareTransition, startTransition])

  const midRangeId = useId()
  const midRangeListId = useId()

  return (
    <Card padding={4} tone={tone} shadow={1}>
      <Stack space={4}>
        <Legend>{tone}</Legend>
        <Grid columns={3} style={{ paddingLeft: 'env(safe-area-inset-left)' }}>
          <HueColorInput
            key="mid"
            label="Mid"
            onChange={midChangeHandler}
            value={mid.length === 4 ? `${mid}${mid.replace(/^#/, '')}` : mid}
          />
          <HueColorInput
            key="lightest"
            label="Lightest"
            onChange={lightestChangeHandler}
            value={
              lightest.length === 4
                ? `${lightest}${lightest.replace(/^#/, '')}`
                : lightest
            }
          />
          <HueColorInput
            key="darkest"
            label="Darkest"
            onChange={darkestChangeHandler}
            value={
              darkest.length === 4
                ? `${darkest}${darkest.replace(/^#/, '')}`
                : darkest
            }
          />
        </Grid>
        <Stack style={{ paddingLeft: 'env(safe-area-inset-left)' }} space={2}>
          <label htmlFor={midRangeId}>
            <Label>Mid point ({midPointRounded})</Label>
          </label>
          <RangeInput
            min={50}
            max={950}
            step={1}
            value={midPoint}
            id={midRangeId}
            list={midRangeListId}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                event.preventDefault()
                setMidPoint((midPoint) => {
                  const midPointRounded = roundMidPoint(Number(midPoint))
                  if (midPointRounded === 100) {
                    return '50'
                  }
                  if (midPointRounded === 950) {
                    return '900'
                  }
                  if (midPointRounded > 100) {
                    return `${midPointRounded - 100}`
                  }

                  return midPoint
                })
              }
              if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                event.preventDefault()
                setMidPoint((midPoint) => {
                  const midPointRounded = roundMidPoint(Number(midPoint))
                  if (midPointRounded === 50) {
                    return '100'
                  }
                  if (midPointRounded === 900) {
                    return '950'
                  }
                  if (midPointRounded < 900) {
                    return `${midPointRounded + 100}`
                  }

                  return midPoint
                })
              }
            }}
            onChange={(event) => {
              prepareTransition()
              setMidPoint(event.target.value)
            }}
            onPointerUp={() => {
              prepareTransition()
              setMidPoint((midPoint) => `${roundMidPoint(Number(midPoint))}`)
            }}
            onBlur={() => {
              prepareTransition()
              setMidPoint((midPoint) => `${roundMidPoint(Number(midPoint))}`)
            }}
          />
          <datalist id={midRangeListId}>
            {COLOR_TINTS.map((tint) => (
              <option key={tint} value={tint} label={tint} />
            ))}
          </datalist>
        </Stack>
        <Card tone="inherit" shadow={1} radius={1} overflow="hidden">
          <Suspense fallback={<Skeleton paddingY={2} animated radius={1} />}>
            <Grid columns={11}>
              <ColorTintsPreview
                tone={tone}
                mid={mid}
                // Use midPoint instead of midPointRounded as it looks and feels better when dragging the mid point slider
                midPoint={midPoint as any}
                lightest={lightest}
                darkest={darkest}
              />
            </Grid>
          </Suspense>
        </Card>
      </Stack>
    </Card>
  )
})

const Legend = styled(Text).attrs({ size: 1, weight: 'medium' })`
  text-transform: capitalize;
  padding-left: env(safe-area-inset-left);
`
