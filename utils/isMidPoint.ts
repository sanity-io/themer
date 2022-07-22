import type { Hue } from 'utils/types'
import { validMidPoints } from 'utils/validMidPoints'

export const isMidPoint = (input: number): input is Hue['midPoint'] =>
  validMidPoints.has(input)
