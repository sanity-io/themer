import { useRootTheme } from '@sanity/ui'
import {
  NextStudioGlobalStyle,
  NextStudioHead,
} from 'next-sanity/studio'
import png from 'public/favicon.png'
import svg from 'public/favicon.svg'
import { memo } from 'react'

const title = 'Themer | Create Sanity Studio v3 themes 🪄'

interface Props {
  presetUrl: string
}
function Head({ presetUrl }: Props) {
  const { light, dark } = useRootTheme().theme.color

  // @TODO find a better way to override the page title
  // Page title is overriden by StudioLayout
  /*
  useEffect(() => {
    if (document.title !== title) {
      document.title = title
    }
  })
  // */
  return (
    <>
      <NextStudioHead
        title={title}
        themeColorLight={light.default.base.bg}
        themeColorDark={dark.default.base.bg}
      >
        {/* Use Edge Middleware to set this preload as a header to work with custom presets */}
        <link rel="modulepreload" href={presetUrl} />
        <link rel="icon" type="image/svg" href={svg.src} />
        <link rel="icon" type="image/png" href={png.src} />
      </NextStudioHead>
      <NextStudioGlobalStyle bg={light.default.base.bg} />
    </>
  )
}

export default memo(Head)
