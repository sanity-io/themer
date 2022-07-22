import {
  type ThemeColorSchemeKey,
  Grid,
  ThemeProvider,
  useElementRect,
} from '@sanity/ui'
import StudioPreview from 'components/StudioPreview'
import { useMagicRouter } from 'hooks/useMagicRouter'
import {
  type TransitionStartFunction,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { type StudioProviderProps, type WorkspaceOptions } from 'sanity'
import styled from 'styled-components'

export type View = 'default' | 'split'

interface Props extends Pick<StudioProviderProps, 'unstable_noAuthBoundary'> {
  config: WorkspaceOptions[]
  scheme: ThemeColorSchemeKey
  sidebarWidth: number
  theme: WorkspaceOptions['theme']
  view: View
}
export const StudioViewer = memo(function StudioViewer({
  config,
  scheme,
  sidebarWidth,
  theme: _theme,
  unstable_noAuthBoundary,
  view,
}: Props) {
  const history = useMagicRouter('hash')

  const uglyHackRef = useRef(null)
  const uglyHackRect = useElementRect(uglyHackRef.current)

  const theme = useMemo(
    () => ({
      ..._theme, // Adjust media queries to fit the sidebar
      media:
        view === 'split'
          ? [
              360 * 2 + sidebarWidth,
              600 * 2 + sidebarWidth,
              900 * 1.5 + sidebarWidth,
              1200 + sidebarWidth,
              1800 + sidebarWidth / 2,
              2400,
            ]
          : [360 + sidebarWidth, 600 + sidebarWidth / 2, 900, 1200, 1800, 2400],
    }),
    [_theme, sidebarWidth, view]
  )

  return (
    // @TODO replace this ThemeProvider scheme hack with just a Card and a Grid
    <ThemeProvider scheme="dark">
      <ViewerGrid
        ref={uglyHackRef}
        height="fill"
        columns={[1, view === 'split' ? 2 : 1]}
        // @TODO fix rows layout
        // rows={[view === 'split' ? 2 : 1, 1]}
        /*
      style={{
        height: view === 'split' ? '200dvh' : '100dvh',
        maxHeight:  view === 'split' ? '200vh' :'100vh',
        overflow: 'auto',
      }}
      // */
        // @TODO fix scroll on mobile split view
        style={{
          ['--ugly-hack-width' as any]:
            uglyHackRef?.current && uglyHackRect?.width
              ? `${uglyHackRect.width}px`
              : undefined,
          ['--ugly-hack-height' as any]:
            uglyHackRef?.current && uglyHackRect?.height
              ? `${
                  /*view === 'split'
              ? uglyHackRect.height / 2
              : */ uglyHackRect.height
                }px`
              : undefined,
        }}
      >
        <StudioPreview
          // updating the key with the view forces the updated media queries to apply
          key={view}
          config={config}
          scheme={scheme}
          theme={theme}
          unstable_history={history}
          unstable_noAuthBoundary={unstable_noAuthBoundary}
        />
        {view === 'split' && (
          <StudioPreview
            key="aside"
            config={config}
            scheme={scheme === 'dark' ? 'light' : 'dark'}
            theme={theme}
            unstable_history={history}
            unstable_noAuthBoundary={unstable_noAuthBoundary}
          />
        )}
      </ViewerGrid>
    </ThemeProvider>
  )
})

export const useStudioViewer = ({
  startTransition,
}: {
  startTransition: TransitionStartFunction
}) => {
  const [view, setView] = useState<View>('default')
  const toggleView = useCallback(
    () =>
      startTransition(() =>
        setView((view) => (view === 'default' ? 'split' : 'default'))
      ),
    [startTransition]
  )

  return { view, toggleView }
}

// Trying to impress Snorre with my 1337 CSS haxxor
const ViewerGrid = styled(Grid)`
  position: relative;
  gap: 1px;
  background-color: ${({ theme }) => theme.sanity.color.base.border};
  overflow: auto;
  height: 50vh;
  max-height: 50dvh;

  @media (min-width: ${({ theme }) => theme.sanity.media[1]}px) {
    height: 100vh;
    max-height: 100dvh;
  }

  & [data-ui='ToolScreen'] {
    /* @TODO investigate if it's safe to set overflow: hidden on these */
    overflow: ${({ columns }) => (columns[1] === 1 ? 'visible' : 'hidden')};
  }

  & [data-ui='Navbar'] + div {
    top: calc(100vh - var(--ugly-hack-height, 0));
    top: calc(100dvh - var(--ugly-hack-height, 0));
    left: calc(100vw - var(--ugly-hack-width, 0));
    left: calc(100dvw - var(--ugly-hack-width, 0));
  }
`
