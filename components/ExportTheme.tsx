import { InfoOutlineIcon } from '@sanity/icons'
import { Box, Dialog, Grid, Stack } from '@sanity/ui'
import CodeSnippetSetup from 'components/CodeSnippetSetup'
import CopySnippetButton from 'components/CopySnippetButton'
import {
  FilesViewer,
  QuizButton,
  QuizRow,
  TransitionMinHeight,
} from 'components/ExportTheme.styles'
import { Button, Label } from 'components/Sidebar.styles'
import JSON5 from 'json5'
import { type Dispatch, memo, useMemo, useReducer } from 'react'
import { shortenPresetSearchParams } from 'utils/shortenPresetSearchParams'
import { snippet } from 'utils/snippets'

// Support for URL Imports in TS isn't quite there yet
// Setting up a themer.d.ts is a decent workaround for now
// https://github.com/microsoft/TypeScript/issues/35749
type QuizBuild = 'sanity build' | 'next build' | 'other'
type QuizLoad = 'build-time' | 'runtime'
type QuizTypeScript = boolean
type QuizAction =
  | { type: 'build'; payload: QuizBuild }
  | { type: 'load'; payload: QuizLoad }
  | { type: 'typescript'; payload: QuizTypeScript }

export type QuizDispatch = Dispatch<QuizAction>

export interface QuizState {
  build?: QuizBuild
  load?: QuizLoad
  typescript?: QuizTypeScript
}

const initialQuizState: QuizState = {
  build: null,
  load: null,
  typescript: null,
}

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'build':
      return { ...state, build: action.payload }
    case 'load':
      return { ...state, load: action.payload }
    case 'typescript':
      return { ...state, typescript: action.payload }
    default:
      return state
  }
}

interface Props {
  searchParams: URLSearchParams
  open: 'export' | 'export-dialog'
  onOpen: () => void
  onClose: () => void
}
const ExportTheme = ({ searchParams, open, onClose, onOpen }: Props) => {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState)

  const esmUrl = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    shortenPresetSearchParams(params)
    if (params.get('preset') === 'default') {
      params.delete('preset')
    }
    if (process.env.NODE_ENV === 'production') {
      params.set('min', '1')
    }
    const search = decodeURIComponent(params.toString())
    return new URL(
      `/api/hues${search ? `?${search}` : ''}`,
      location.origin
    ).toString()
  }, [searchParams])
  const esmUrlDTS = useMemo(() => {
    const url = new URL(esmUrl)
    return `${url.origin}${url.pathname}?*`
  }, [esmUrl])
  const esmUrlOrigin = useMemo(() => {
    const url = new URL(esmUrl)
    return `${url.origin}/`
  }, [esmUrl])
  const downloadUrl = useMemo(() => {
    const url = new URL(esmUrl)
    url.searchParams.delete('min')
    return url.toString()
  }, [esmUrl])

  return (
    <>
      <Stack space={3}>
        <Stack space={2}>
          <Label>First time exporting? 🤷</Label>
          <Button
            tone="primary"
            icon={InfoOutlineIcon}
            text="Read the guide"
            onClick={() => onOpen()}
          />
        </Stack>
        <Stack space={2}>
          <Label>Paste this into your sanity.config.ts 🧑‍💻</Label>
          <Grid columns={2} gap={2}>
            <CopySnippetButton
              text="Copy JS"
              toastTitle="Copied JS snippet to the clipboard"
              // code={`const {theme} = await import(${JSON.stringify(esmUrl)})`}
              code={snippet('import-dynamic-js')(JSON5.stringify(esmUrl))}
            />
            <CopySnippetButton
              text="Copy TS"
              toastTitle="Copied TS snippet to the clipboard"
              code={snippet('import-dynamic-ts')(JSON5.stringify(esmUrl))}
            />
          </Grid>
        </Stack>
      </Stack>
      {open === 'export-dialog' && (
        <Dialog
          key="export"
          header="Theme Export Wizard 🧙"
          id="dialog-download-preset"
          onClose={onClose}
          zOffset={1000}
          width={2}
        >
          <Box padding={4}>
            <QuizRow key="state.build" text="How do you build your studio?">
              <QuizButton
                text="sanity build"
                onClick={() =>
                  dispatch({ type: 'build', payload: 'sanity build' })
                }
                selected={state.build === 'sanity build'}
              />
              <QuizButton
                text="next build"
                onClick={() =>
                  dispatch({ type: 'build', payload: 'next build' })
                }
                selected={state.build === 'next build'}
              />
              <QuizButton
                text="custom"
                onClick={() => dispatch({ type: 'build', payload: 'other' })}
                selected={state.build === 'other'}
              />
            </QuizRow>
            <TransitionMinHeight key="state.typescript">
              {state.build && (
                <QuizRow text="Are you using TypeScript?">
                  <QuizButton
                    text="Yes"
                    mode="bleed"
                    onClick={() =>
                      dispatch({ type: 'typescript', payload: true })
                    }
                    selected={state.typescript === true}
                  />
                  <QuizButton
                    text="No, but I should be"
                    mode="bleed"
                    onClick={() =>
                      dispatch({ type: 'typescript', payload: false })
                    }
                    selected={state.typescript === false}
                  />
                </QuizRow>
              )}
            </TransitionMinHeight>
            <TransitionMinHeight key="state.load">
              {state.typescript !== null && state.build === 'next build' && (
                <QuizRow text="Load the theme at?">
                  <QuizButton
                    text="Build time"
                    onClick={() =>
                      dispatch({ type: 'load', payload: 'build-time' })
                    }
                    selected={state.load === 'build-time'}
                  />
                  <QuizButton
                    text="Runtime"
                    onClick={() =>
                      dispatch({ type: 'load', payload: 'runtime' })
                    }
                    selected={state.load === 'runtime'}
                  />
                </QuizRow>
              )}
            </TransitionMinHeight>
            <TransitionMinHeight key="snippets">
              <Stack space={4}>
                <CodeSnippetSetup
                  state={state}
                  esmUrl={esmUrl}
                  esmUrlDTS={esmUrlDTS}
                  esmUrlOrigin={esmUrlOrigin}
                  downloadUrl={downloadUrl}
                />
                {(state.build === 'sanity build' ||
                  (state.build === 'next build' &&
                    state.load === 'build-time')) &&
                  state.typescript !== null && (
                    <FilesViewer
                      key="createTheme"
                      lead={
                        <>
                          If you&#39;re quickly iterating on your theme in the
                          comfort of your own Studio it&#39;s annoying to keep
                          changing the import URL to change your theme. You can
                          use the createTheme utility instead.
                        </>
                      }
                      files={[
                        {
                          id: 'studio.config',
                          filename: state.typescript
                            ? 'sanity.config.ts'
                            : 'sanity.config.js',
                          contents: snippet('studio-config-create-theme')(
                            snippet('import-create-theme-dynamic')(
                              JSON5.stringify(esmUrl)
                            )
                          ),
                        },
                      ]}
                    />
                  )}
                {state.build === 'sanity build' && state.typescript !== null && (
                  <FilesViewer
                    key="sanity build _document"
                    lead={
                      <>
                        You can make the studio load faster by adding a
                        modulepreload tag for the theme.{' '}
                        <a
                          href="https://github.com/stipsan/example-v3-studio/tree/main/more/sanity-build"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Example studio
                        </a>
                      </>
                    }
                    files={[
                      {
                        id: '_document',
                        filename: state.typescript
                          ? '_document.tsx'
                          : '_document.js',
                        contents: state.typescript
                          ? snippet('_document.tsx')(JSON5.stringify(esmUrl))
                          : snippet('_document.js')(JSON5.stringify(esmUrl)),
                      },
                    ]}
                  />
                )}
              </Stack>
            </TransitionMinHeight>
          </Box>
        </Dialog>
      )}
    </>
  )
}

export default memo(ExportTheme)
