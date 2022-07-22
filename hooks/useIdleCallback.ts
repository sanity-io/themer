// Uses requestIdleCallback to let the browser throttle the queue as needed, to reduce jank
// Then uses startTransition to let React know other updates can interrupt this one

import {
  type TransitionStartFunction,
  startTransition as _startTransition,
  useCallback,
  useRef,
} from 'react'

const canIdle = typeof requestIdleCallback === 'function'

// Provide both requestTransition and startTransition from useTransition to allow a rich
// activity indicator to respond to work that is scheduled, and transitions that React is doing behind the scenes
interface Props {
  startTransition?: TransitionStartFunction
  requestTransition?: () => void
}
export function useIdleCallback(
  cb: (...args) => void,
  { requestTransition, startTransition = _startTransition }: Props = {}
) {
  // startTransition alone is not enough, so we use a combo of requestIdleCallback if available, with a fallback to requestAnimationFrame
  // This is to avoid as much main thread jank as we can, while keeping the color picking experience as fast and delightful as the hardware allows
  const throttleRef = useRef(0)

  return useCallback<typeof cb>(
    (...args) => {
      requestTransition?.()
      if (canIdle) {
        cancelIdleCallback(throttleRef.current)
      } else {
        cancelAnimationFrame(throttleRef.current)
      }

      const scheduleTransition = () =>
        void startTransition(() => void cb(...args))
      if (canIdle) {
        throttleRef.current = requestIdleCallback(scheduleTransition)
      } else {
        throttleRef.current = requestAnimationFrame(scheduleTransition)
      }
    },
    [cb, requestTransition, startTransition]
  )
}
