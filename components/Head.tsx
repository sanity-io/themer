import { useRootTheme } from '@sanity/ui'
import Head from 'next/head'
import { NextStudioHead } from 'next-sanity/studio/head'
import png from 'public/favicon.png'
import svg from 'public/favicon.svg'
import { memo } from 'react'
import { createGlobalStyle, css } from 'styled-components'

interface NextStudioGlobalStyleProps {
  fontFamily?: string
  bg?: string
  unstable__tailwindSvgFix?: boolean
}
const NextStudioGlobalStyle = createGlobalStyle<NextStudioGlobalStyleProps>`
${({ bg }) =>
  bg
    ? css`
        html {
          background-color: ${bg};
        }
      `
    : ''}
html,
body,
#__next {
  height: 100%;
}
body {
  margin: 0;
  overscroll-behavior: none;
  -webkit-font-smoothing: antialiased;
}
${({ fontFamily }) =>
  fontFamily
    ? css`
        #__next {
          font-family: ${fontFamily};
        }
      `
    : ''}
${({ unstable__tailwindSvgFix }) =>
  unstable__tailwindSvgFix
    ? css`
        /* override tailwind reset */
        :root svg {
          display: inline;
        }
      `
    : ''}`

const title = 'Themer | Create Sanity Studio v3 themes 🪄'

interface Props {
  presetUrl: string
}
function CustomHead({ presetUrl }: Props) {
  const theme = useRootTheme().theme
  const { light, dark } = theme.color

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
      <Head>
        <title>{title}</title>
        <NextStudioHead favicons={false} />
        title={title}
        themeColorLight={light.default.base.bg}
        themeColorDark={dark.default.base.bg}
        {/* Use Edge Middleware to set this preload as a header to work with custom presets */}
        <link rel="modulepreload" href={presetUrl} />
        <link rel="icon" type="image/svg" href={svg.src} />
        <link rel="icon" type="image/png" href={png.src} />
      </Head>
      <NextStudioGlobalStyle
        bg={light.default.base.bg}
        fontFamily={theme.fonts.text.family}
        unstable__tailwindSvgFix
      />
    </>
  )
}

export default memo(CustomHead)
