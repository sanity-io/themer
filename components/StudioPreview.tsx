import {
  type ThemeColorSchemeKey,
  ThemeProvider,
  // type ThemeProviderProps,
} from '@sanity/ui'
import SyncColorScheme from 'components/SyncColorScheme'
import { createContext, memo, useContext, useMemo } from 'react'
import {
  type LayoutProps,
  type StudioProviderProps,
  type WorkspaceOptions,
  definePlugin,
  Studio,
  StudioLayout,
  StudioProvider,
} from 'sanity'

const ThemerThemeContext = createContext(null)
const ThemerSchemeContext = createContext<ThemeColorSchemeKey>('light')

function ThemerPreview(props: LayoutProps){
console.log('ThemerPreview', props)
const theme = useContext(ThemerThemeContext)
const scheme = useContext(ThemerSchemeContext)

return <ThemeProvider theme={theme} scheme={scheme}>{props.renderDefault(props)}</ThemeProvider>
}

const themerPlugin = definePlugin({
  name: 'themer',
  studio: {
    components: {
      layout: ThemerPreview
    }
  }
})

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
  /*
  // It's necessary to add the theme to each workspace as it's used for toast notifications and more
  const config = useMemo(
    () => _config.map((workspace) => ({ ...workspace, theme, plugins: [...workspace.plugins, themerPlugin()] })),
    [_config, theme]
  )
  // */
  const config = useMemo(
    () => _config.map((workspace) => ({ ...workspace, plugins: [...workspace.plugins, themerPlugin()] })),
    [_config]
  )
  console.log('config', config)
  return <ThemerSchemeContext.Provider value={scheme}><ThemerThemeContext.Provider value={theme}><Studio config={config}
  unstable_noAuthBoundary={unstable_noAuthBoundary}
  unstable_history={unstable_history}
  scheme={scheme}  /></ThemerThemeContext.Provider>
  </ThemerSchemeContext.Provider>

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
