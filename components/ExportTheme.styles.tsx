import type { ResizeObserverEntry } from '@juggle/resize-observer'
import { ResizeObserver } from '@juggle/resize-observer'
import {
  Badge,
  Box,
  Card,
  Flex,
  Inline,
  Stack,
  Text,
} from '@sanity/ui'
import CodeSnippet from 'components/CodeSnippet'
import { Button } from 'components/Sidebar.styles'
import { useIdleCallback } from 'hooks/useIdleCallback'
import { animate, spring } from 'motion'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import styled from 'styled-components'

interface QuizRowProps {
  children: ReactNode
  text: ReactNode
}
export const QuizRow = ({ children, text }: QuizRowProps) => {
  return (
    <TransitionHeight>
      <Stack space={2} paddingBottom={4}>
        <Text muted size={1}>
          {text}
        </Text>
        <Inline space={1}>{children}</Inline>
      </Stack>
    </TransitionHeight>
  )
}

export const QuizButton = styled(Button).attrs({ mode: 'bleed' })``

type TransitionHeightProps = {
  children: ReactNode
}
export const TransitionHeight = ({ children }: TransitionHeightProps) => {
  const [height, setHeight] = useState(0)
  const canOverflowClip = useRef(true)
  const animated = useRef<HTMLDivElement>(null)
  const observed = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    animated.current.style.opacity = '0'
    animated.current.style.overflow = 'clips'
    if (animated.current.style.overflow !== 'clip') {
      animated.current.style.overflow = 'hidden'
      canOverflowClip.current = false
    }
    animated.current.style.height = '0px'
    const handleResize = (entries: ResizeObserverEntry[]) => {
      setHeight(entries[0].borderBoxSize[0].blockSize)
    }
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(observed.current, { box: 'border-box' })

    return () => resizeObserver.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (!canOverflowClip.current) {
      animated.current.scrollTop = 0
    }
    animate(
      animated.current,
      { height: `${height}px`, opacity: 1 },
      { easing: spring() }
    )
  }, [height])

  return (
    <div ref={animated}>
      <div ref={observed}>{children}</div>
    </div>
  )
}

type TransitionMinHeightProps = {
  children: ReactNode
}
export const TransitionMinHeight = ({ children }: TransitionMinHeightProps) => {
  const [minHeight, setMinHeight] = useState(0)
  const animated = useRef<HTMLDivElement>(null)
  const observed = useRef<HTMLDivElement>(null)
  const handleResize = useIdleCallback(
    useCallback(
      (entries: ResizeObserverEntry[]) =>
        setMinHeight(entries[0].borderBoxSize[0].blockSize),
      []
    )
  )
  const startAnimation = useIdleCallback(
    useCallback(() => {
      animate(
        animated.current,
        { minHeight: `${minHeight}px` },
        { easing: spring() }
      )
    }, [minHeight])
  )

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(observed.current, { box: 'border-box' })

    return () => resizeObserver.disconnect()
  }, [handleResize])

  useEffect(() => void startAnimation(), [startAnimation])

  return (
    <div ref={animated}>
      <div ref={observed}>{children}</div>
    </div>
  )
}

interface FilesViewerProps {
  files: {
    id?: string
    filename: string
    contents?: string
    component?: ReactNode
    language?: 'json'
  }[]
  initial?: string
  lead: ReactNode
}
export const FilesViewer = ({ lead, files, initial }: FilesViewerProps) => {
  const [open, setOpen] = useState(initial)
  const active = useMemo(
    () => files.find(({ filename, id = filename }) => id === open),
    [files, open]
  )
  const selectedRef = useRef<HTMLButtonElement>(null)

  // Allow a viewer to be initially open while toggling typescript on/off
  useLayoutEffect(() => {
    if (initial && open && !active) {
      setOpen(initial)
    }
  }, [initial, open, active])

  // Scroll the selected button into view
  useEffect(() => {
    if (open && selectedRef.current) {
      scrollIntoView(selectedRef.current, {
        behavior: 'smooth',
        inline: 'center',
      })
    }
  }, [open])

  return (
    <TransitionHeight>
      <Box>
        <TransitionMinHeight>
          <Text size={1}>
            <Flex
              paddingTop={1}
              paddingBottom={3}
              gap={1}
              wrap="wrap"
              align="center"
            >
              {lead}
            </Flex>
          </Text>
        </TransitionMinHeight>
        <Card tone="transparent" border radius={2}>
          <Card tone="default" radius={2} overflow="auto" padding={3}>
            <Flex style={{ width: 'fit-content' }} gap={1}>
              {files.map(({ filename, id = filename }) => (
                <Button
                  key={id}
                  ref={id === open ? selectedRef : undefined}
                  mode="bleed"
                  text={filename}
                  selected={id === open}
                  onClick={() => setOpen((open) => (open === id ? null : id))}
                />
              ))}
            </Flex>
          </Card>
          {active &&
            (active.component ? (
              active.component
            ) : (
              <CodeSnippet key={active.filename} language={active.language}>
                {active.contents}
              </CodeSnippet>
            ))}
        </Card>
      </Box>
    </TransitionHeight>
  )
}

export const FilenameBadge = styled(Badge).attrs({ fontSize: 0 })`
  span {
    text-transform: none;
  }
`
