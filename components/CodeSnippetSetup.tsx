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
          {state.typescript ? (
            <>
              Before you can add the import snippet to your{' '}
              <FilenameBadge>sanity.config.ts</FilenameBadge>
              you&#39;ll need to add <FilenameBadge>
                themer.d.ts
              </FilenameBadge>{' '}
              to your project.
            </>
          ) : (
            <>
              <FilenameBadge>sanity.config.js</FilenameBadge> supports URL ESM
              imports out of the box.
            </>
          )}
          <a
            href="https://github.com/sanity-io/themer/tree/main/examples/basic"
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
          <FilenameBadge>next.config.js</FilenameBadge> .{' '}
          <a
            href="https://github.com/sanity-io/themer/tree/main/examples/next-static"
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
            href="https://github.com/sanity-io/themer/tree/main/examples/next-dynamic"
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

    if (state.build === 'sanity build') {
      return state.typescript
        ? [
            {
              id: 'sanity.config',
              filename: 'sanity.config.ts',
              contents: snippet('studio-config')(
                snippet('import-static')(JSON5.stringify(esmUrl))
              ),
            },
            themerDts,
          ]
        : [
            {
              id: 'sanity.config',
              filename: 'sanity.config.js',
              contents: snippet('studio-config')(
                snippet('import-static')(JSON5.stringify(esmUrl))
              ),
            },
          ]
    }

    if (state.build === 'next build' && state.load === 'build-time') {
      return state.typescript
        ? [
            {
              id: 'sanity.config',
              filename: 'sanity.config.ts',
              contents: snippet('studio-config')(
                snippet('import-static')(JSON5.stringify(esmUrl))
              ),
            },
            {
              filename: 'next.config.js',
              contents: snippet('next-config-build-time-ts')(
                JSON5.stringify(esmUrlOrigin)
              ),
            },
            themerDts,
          ]
        : [
            {
              id: 'sanity.config',
              filename: 'sanity.config.js',
              contents: snippet('studio-config')(
                snippet('import-static')(JSON5.stringify(esmUrl))
              ),
            },
            {
              filename: 'next.config.js',
              contents: snippet('next-config-build-time-js')(
                JSON5.stringify(esmUrlOrigin)
              ),
            },
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
              mode="ghost"
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

  return <FilesViewer lead={lead} initial={initial} files={files} />
}

export default memo(CodeSnippetSetup)
