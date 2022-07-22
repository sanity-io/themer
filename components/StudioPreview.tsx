import {
  type ThemeColorSchemeKey,
  // type ThemeProviderProps,
} from '@sanity/ui'
import SyncColorScheme from 'components/SyncColorScheme'
import { memo, useMemo } from 'react'
import {
  type StudioProviderProps,
  type WorkspaceOptions,
  StudioLayout,
  StudioProvider,
} from 'sanity'

interface Props
  extends Pick<
    StudioProviderProps,
    'unstable_history' | 'unstable_noAuthBoundary'
  > {
  config: WorkspaceOptions[]
  scheme: ThemeColorSchemeKey
  theme: WorkspaceOptions['theme']
}
const StudioPreview = ({
  config: _config,
  scheme,
  theme,
  unstable_history,
  unstable_noAuthBoundary,
}: Props) => {
  // It's necessary to add the theme to each workspace as it's used for toast notifications and more
  const config = useMemo(
    () => _config.map((workspace) => ({ ...workspace, theme })),
    [_config, theme]
  )

  return (
    <StudioProvider
      config={config}
      unstable_noAuthBoundary={unstable_noAuthBoundary}
      unstable_history={unstable_history}
      scheme={scheme}
      // @TODO onSchemeChange doesn't work properly when using the SyncColorScheme workaround
      // onSchemeChange={(nextScheme) => setForceScheme(nextScheme)}
    >
      <SyncColorScheme forceScheme={scheme} />
      <StudioLayout />
      {/* <ThemeProvider
        // Workaround media queries not updating by changing the key
        // key={view === 'split' ? 'light' : 'default'}
        theme={theme}
        scheme={scheme}
      >
        <StudioLayout />
      </ThemeProvider> */}
    </StudioProvider>
  )
}

export default memo(StudioPreview)
