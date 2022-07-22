import { DownloadIcon } from '@sanity/icons'
import { Button, Card } from '@sanity/ui'
import type { QuizState } from 'components/ExportTheme'
import { FilenameBadge, FilesViewer } from 'components/ExportTheme.styles'
import JSON5 from 'json5'
import { memo, useMemo } from 'react'
import { snippet } from 'utils/snippets'

interface Props {
  state: QuizState
  esmUrl: string
  esmUrlDTS: string
  esmUrlOrigin: string
  downloadUrl: string
}
const CodeSnippetSetup = ({
  state,
  esmUrl,
  esmUrlDTS,
  esmUrlOrigin,
  downloadUrl,
}: Props) => {
  const lead = useMemo(() => {
    if (state.build === 'sanity build') {
      return (
        <>
          Before you can add the import snippet to your
          {state.typescript ? (
            <>
              <FilenameBadge>sanity.config.ts</FilenameBadge>
              you&#39;ll need to make a few changes to{' '}
              <FilenameBadge>sanity.cli.ts</FilenameBadge> and{' '}
              <FilenameBadge>tsconfig.json</FilenameBadge> .
            </>
          ) : (
            <>
              <FilenameBadge>sanity.config.js</FilenameBadge> you&#39;ll need to
              make a change to <FilenameBadge>sanity.cli.js</FilenameBadge>.
            </>
          )}
          <a
            href="https://github.com/stipsan/example-v3-studio"
            target="_blank"
            rel="noreferrer"
          >
            Example studio
          </a>
        </>
      )
    }

    if (state.build === 'next build' && state.load === 'build-time') {
      return (
        <>
          Before you can add the import snippet to your
          <FilenameBadge>
            sanity.config.{state.typescript ? 'ts' : 'js'}
          </FilenameBadge>
          you&#39;ll need to make a few changes to{' '}
          <FilenameBadge>next.config.js</FilenameBadge> and{' '}
          <FilenameBadge>
            pages/_document.{state.typescript ? 'tsx' : 'js'}
          </FilenameBadge>{' '}
          .{' '}
          <a
            href="https://github.com/stipsan/example-v3-studio/tree/main/more/next-build-time"
            target="_blank"
            rel="noreferrer"
          >
            Example studio
          </a>
        </>
      )
    }

    if (state.build === 'next build' && state.load === 'runtime') {
      return (
        <>
          The benefit of loading at runtime is you can dynamically choose what
          theme to load. You got the full SSR capabilities of Next.js at your
          disposal.{' '}
          <a
            href="https://github.com/stipsan/example-v3-studio-next-runtime"
            target="_blank"
            rel="noreferrer"
          >
            Example studio
          </a>
        </>
      )
    }

    if (state.build === 'other') {
      return (
        <>
          If the other method&#39;s don&#39;t work, or you run a custom setup,
          you can download the theme manually.
        </>
      )
    }
  }, [state.build, state.load, state.typescript])

  const initial = useMemo(() => {
    if (state.build === 'sanity build') {
      return 'sanity.config'
    }

    if (state.build === 'next build' && state.load === 'build-time') {
      return 'sanity.config'
    }

    if (state.build === 'next build' && state.load === 'runtime') {
      return 'pages-index'
    }

    if (state.build === 'other') {
      return 'theme.js'
    }
  }, [state.build, state.load])

  const files = useMemo(() => {
    const themerDts = {
      filename: 'themer.d.ts',
      contents: snippet('themer.d.ts')(JSON5.stringify(esmUrlDTS)),
    }
    const pageDocumentJs = {
      id: 'pages/_document',
      filename: 'pages/_document.js',
      contents: snippet('pages/_document.js')(),
    }

    if (state.build === 'sanity build') {
      return state.typescript
        ? [
            {
              id: 'sanity.config',
              filename: 'sanity.config.ts',
              contents: snippet('studio-config')(
                snippet('import-dynamic-js')(JSON5.stringify(esmUrl))
              ),
            },
            {
              id: 'sanity.cli',
              filename: 'sanity.cli.ts',
              contents: snippet('sanity.cli.ts')(),
            },
            {
              filename: 'tsconfig.json',
              contents: snippet('tsconfig')(),
              language: 'json' as const,
            },
            themerDts,
          ]
        : [
            {
              id: 'sanity.config',
              filename: 'sanity.config.js',
              contents: snippet('studio-config')(
                snippet('import-dynamic-js')(JSON5.stringify(esmUrl))
              ),
            },
            {
              id: 'sanity.cli',
              filename: 'sanity.cli.js',
              contents: snippet('sanity.cli.js')(),
            },
          ]
    }

    if (state.build === 'next build' && state.load === 'build-time') {
      return state.typescript
        ? [
            {
              id: 'sanity.config',
              filename: 'sanity.config.ts',
              contents: snippet('studio-config-static-import')(
                snippet('import-static')(JSON5.stringify(esmUrl))
              ),
            },
            {
              filename: 'next.config.js',
              contents: snippet('next-config-build-time-ts')(
                JSON5.stringify(esmUrlOrigin)
              ),
            },
            {
              id: 'pages/_document',
              filename: 'pages/_document.tsx',
              contents: snippet('pages/_document.tsx')(),
            },
            themerDts,
          ]
        : [
            {
              id: 'sanity.config',
              filename: 'sanity.config.js',
              contents: snippet('studio-config-static-import')(
                snippet('import-static')(JSON5.stringify(esmUrl))
              ),
            },
            {
              filename: 'next.config.js',
              contents: snippet('next-config-build-time-js')(
                JSON5.stringify(esmUrlOrigin)
              ),
            },
            pageDocumentJs,
          ]
    }

    if (state.build === 'next build' && state.load === 'runtime') {
      return state.typescript
        ? [
            {
              id: 'pages-index',
              filename: 'pages/[[...index]].tsx',
              contents: snippet('pages-index')(JSON5.stringify(esmUrl)),
            },
            {
              id: 'sanity.config',
              filename: 'sanity.config.ts',
              contents: snippet('studio-config-next-runtime-1')(),
            },
            {
              id: 'pages/_document',
              filename: 'pages/_document.tsx',
              contents: snippet('pages/_document.tsx')(),
            },
            themerDts,
          ]
        : [
            {
              id: 'pages-index',
              filename: 'pages/[[...index]].js',
              contents: snippet('pages-index')(JSON5.stringify(esmUrl)),
            },
            {
              id: 'sanity.config',
              filename: 'sanity.config.js',
              contents: snippet('studio-config-next-runtime-1')(),
            },
            pageDocumentJs,
          ]
    }

    if (state.build === 'other') {
      const themeJs = {
        filename: 'theme.js',
        component: (
          <Card
            style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
            tone="transparent"
            padding={4}
            radius={2}
            shadow={1}
          >
            <Button
              style={{ width: '100%' }}
              text="Download"
              icon={DownloadIcon}
              as="a"
              href={downloadUrl}
              download="theme.js"
              mode="bleed"
            />
          </Card>
        ),
      }
      return state.typescript
        ? [
            themeJs,
            {
              id: 'sanity.config',
              filename: 'sanity.config.ts',
              contents: snippet('studio-config-local-import-ts')(),
            },
          ]
        : [
            themeJs,
            {
              id: 'sanity.config',
              filename: 'sanity.config.js',
              contents: snippet('studio-config-local-import')(),
            },
          ]
    }
  }, [
    downloadUrl,
    esmUrl,
    esmUrlDTS,
    esmUrlOrigin,
    state.build,
    state.load,
    state.typescript,
  ])

  const shouldRender = useMemo(() => {
    if (state.build === 'sanity build') {
      return state.typescript !== null
    }

    if (state.build === 'next build' && state.load === 'build-time') {
      return true
    }

    if (state.build === 'next build' && state.load === 'runtime') {
      return true
    }

    if (state.build === 'other') {
      return state.typescript !== null
    }

    return false
  }, [state.build, state.load, state.typescript])

  if (!shouldRender) {
    return null
  }

  return (
    <>
      <FilesViewer lead={lead} initial={initial} files={files} />
    </>
  )
}

export default memo(CodeSnippetSetup)
