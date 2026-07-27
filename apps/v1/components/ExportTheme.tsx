import { InfoOutlineIcon } from '@sanity/icons'
import { Box, Dialog, Stack } from '@sanity/ui'
import CopySnippetButton from 'components/CopySnippetButton'
import { FilenameBadge, FilesViewer } from 'components/ExportTheme.styles'
import { Button, Label } from 'components/Sidebar.styles'
import JSON5 from 'json5'
import { memo, useMemo } from 'react'
import { shortenPresetSearchParams } from 'utils/shortenPresetSearchParams'
import { snippet } from 'utils/snippets'

const installCommand = 'npm install @sanity/themer'

interface Props {
  searchParams: URLSearchParams
  open: 'export' | 'export-dialog'
  onOpen: () => void
  onClose: () => void
}
const ExportTheme = ({ searchParams, open, onClose, onOpen }: Props) => {
  // `@sanity/themer/legacy` reads the hues straight out of this URL, it never fetches it
  const themerUrl = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    shortenPresetSearchParams(params)
    if (params.get('preset') === 'default') {
      params.delete('preset')
    }
    const search = decodeURIComponent(params.toString())
    return new URL(
      `/api/hues${search ? `?${search}` : ''}`,
      location.origin,
    ).toString()
  }, [searchParams])
  const themerUrlArg = useMemo(() => JSON5.stringify(themerUrl), [themerUrl])

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
          <CopySnippetButton
            text="Copy snippet"
            toastTitle="Copied the theme snippet to the clipboard"
            code={snippet('theme-import')(themerUrlArg)}
          />
        </Stack>
      </Stack>
      {open === 'export-dialog' && (
        <Dialog
          key="export"
          header="Theme Export Guide 🪄"
          id="dialog-export-theme"
          onClose={onClose}
          zOffset={1000}
          width={2}
        >
          <Box padding={4}>
            <Stack space={4}>
              <FilesViewer
                key="install"
                initial="sanity.config"
                lead={
                  <>
                    Install <FilenameBadge>@sanity/themer</FilenameBadge> and
                    the same snippet works in every Studio, no matter how you
                    build it. TypeScript typings are included.
                  </>
                }
                files={[
                  {
                    id: 'install',
                    filename: 'Terminal',
                    contents: installCommand,
                    language: 'bash',
                  },
                  {
                    id: 'sanity.config',
                    filename: 'sanity.config.ts',
                    contents: snippet('studio-config')(themerUrlArg),
                  },
                ]}
              />
              <FilesViewer
                key="createTheme"
                lead={
                  <>
                    If you&#39;re quickly iterating on your theme in the comfort
                    of your own Studio it&#39;s annoying to keep changing the
                    URL to change your theme. You can read the hues out of the
                    URL and tweak them in code instead.
                  </>
                }
                files={[
                  {
                    id: 'studio.config',
                    filename: 'sanity.config.ts',
                    contents: snippet('studio-config-create-theme')(
                      themerUrlArg,
                    ),
                  },
                ]}
              />
            </Stack>
          </Box>
        </Dialog>
      )}
    </>
  )
}

export default memo(ExportTheme)
