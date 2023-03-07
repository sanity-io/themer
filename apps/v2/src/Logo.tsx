import { animate, spring } from 'motion'
import { memo, useEffect, useRef } from 'react'
import styled from 'styled-components'

const Svg = styled.svg`
  position: relative;
  z-index: 1;
  will-change: transform;
`

const ConicRainbow = styled.div`
  background: conic-gradient(#f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
  position: absolute;
  top: -1px;
  right: -1px;
  bottom: -1px;
  left: -1px;
  transform-origin: center center;
  will-change: transform, opacity;
  opacity: 0.8;
`

const DarkCircle = styled.div`
  background: #000;
  position: absolute;
  top: 2px;
  right: 2px;
  bottom: 2px;
  left: 2px;
  border-radius: 50%;
  transform-origin: center center;
  will-change: transform, opacity;
  opacity: 0.6;
`

const Figure = styled.figure`
  display: block;
  border-radius: 16px;
  overflow: hidden;
  overflow: clip;
  height: 32px;
  margin: 0;
  position: relative;
  width: 32px;
  contain: strict;
  transform: translateZ(0);
`

interface Props {
  spin: number
  transition: boolean
}
function Logo({ spin, transition }: Props) {
  const conicRainbowRef = useRef(null)
  const darkCircleRef = useRef(null)

  useEffect(() => {
    if (conicRainbowRef.current && darkCircleRef.current) {
      if (spin || transition) {
        const unit = 360 / 1.5
        const rewind = unit + Math.random() * unit
        const forward = unit + Math.random() * unit
        const easing = spring({ stiffness: 70 })
        const animation = animate(
          conicRainbowRef.current,
          {
            opacity: transition ? 1 : 0.8,
            rotate: transition ? -rewind : forward,
          },
          {
            // direction: transition ? 'alternate' : undefined,
            easing,
          }
        )

        const animation2 = animate(
          darkCircleRef.current,
          {
            opacity: transition ? 0.7 : 0.6,
            scale: transition ? 1.08 : 1,
          },
          { easing }
        )
        return () => {
          if (transition) {
            animation.stop()
            animation2.reverse()
          }
        }
      }
    }
  }, [spin, transition])

  return (
    <Figure>
      <ConicRainbow ref={conicRainbowRef} />
      <DarkCircle ref={darkCircleRef} />
      <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <g fill="#fff">
          <path d="M9.950524 8.587852c0 2.68311 1.663111 4.293297 4.987729 5.132069l3.528298.819527c3.140184.726509 5.064712 2.521129 5.064712 5.448013.025584 1.276035-.388969 2.521965-1.173963 3.528298 0-2.918866-1.51075-4.490563-5.152916-5.452826l-3.456128-.777826c-2.776129-.64151-4.917164-2.113772-4.917164-5.292448-.012943-1.227906.381899-2.425406 1.12264-3.404807" />
          <path
            opacity="0.5"
            d="M20.193813 19.273783c1.501129.962263 2.163487 2.306223 2.163487 4.238767C21.098341 25.105095 18.925228 26 16.354383 26c-4.312541 0-7.366122-2.141033-8.018857-5.823296h4.147353c.535659 1.699997 1.95179 2.485848 3.83943 2.485848 2.307827 0 3.849051-1.230093 3.871504-3.388769m-8.083008-6.695748c-1.443395-.923772-2.160281-2.224432-2.160281-3.990183 1.204433-1.579715 3.290939-2.545187 5.837729-2.545187 4.407164 0 6.957162 2.328677 7.585839 5.603579h-3.998203c-.441036-1.291037-1.541224-2.298206-3.557164-2.298206-2.149054 0-3.614902 1.249342-3.70792 3.229997"
          />
        </g>
      </Svg>
    </Figure>
  )
}

export default memo(Logo)
