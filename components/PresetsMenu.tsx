import { MusicNoteIcon } from '@heroicons/react/outline'
import {
  DownloadIcon,
  DropIcon,
  HeartIcon,
  LemonIcon,
  MasterDetailIcon,
  PackageIcon,
  SelectIcon,
  UploadIcon,
} from '@sanity/icons'
import {
  Button,
  Card,
  Label,
  Menu,
  MenuButton,
  MenuItem,
  Tab,
  TabList,
  TabPanel,
} from '@sanity/ui'
import ExportTheme from 'components/ExportTheme'
import ImportFromImage from 'components/ImportFromImage'
import ShareTab from 'components/ShareTab'
import {
  type Dispatch,
  type SetStateAction,
  type TransitionStartFunction,
  memo,
  useMemo,
  useState,
} from 'react'
import styled from 'styled-components'
import { expandPresetSearchParams } from 'utils/expandPresetSearchParams'
import { presets } from 'utils/presets'
import type { Hues, ThemePreset } from 'utils/types'

const SynthWaveIcon = styled(MusicNoteIcon)`
  transform: translateX(-1px);
  width: 16px;
  stroke-width: 1.4;
`

const TwLogo = (
  <svg viewBox="0 0 52 31" style={{ width: 16, transform: 'translateY(-3px)' }}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25.517 0C18.712 0 14.46 3.382 12.758 10.146c2.552-3.382 5.529-4.65 8.931-3.805 1.941.482 3.329 1.882 4.864 3.432 2.502 2.524 5.398 5.445 11.722 5.445 6.804 0 11.057-3.382 12.758-10.145-2.551 3.382-5.528 4.65-8.93 3.804-1.942-.482-3.33-1.882-4.865-3.431C34.736 2.92 31.841 0 25.517 0zM12.758 15.218C5.954 15.218 1.701 18.6 0 25.364c2.552-3.382 5.529-4.65 8.93-3.805 1.942.482 3.33 1.882 4.865 3.432 2.502 2.524 5.397 5.445 11.722 5.445 6.804 0 11.057-3.381 12.758-10.145-2.552 3.382-5.529 4.65-8.931 3.805-1.941-.483-3.329-1.883-4.864-3.432-2.502-2.524-5.398-5.446-11.722-5.446z"
      fill="currentColor"
    />
  </svg>
)

// @TODO React.lazy these icons
const iconFromSlug = (slug: string) => {
  return slug === 'pink-synth'
    ? SynthWaveIcon
    : slug === 'tw-cyan'
    ? TwLogo
    : slug === 'dew'
    ? DropIcon
    : slug === 'rosabel'
    ? HeartIcon
    : slug === 'verdant'
    ? LemonIcon
    : MasterDetailIcon
}

interface Props {
  startTransition: TransitionStartFunction
  setPreset: Dispatch<SetStateAction<ThemePreset>>
  prepareTransition: () => void
  onChange: (preset: ThemePreset) => void
  selected: ThemePreset
  hues: Hues
  unstable_showParsedUrl: boolean
}
function PresetsMenu({
  selected,
  onChange,
  hues,
  prepareTransition,
  startTransition,
  setPreset,
  unstable_showParsedUrl,
}: Props) {
  const [open, setOpen] = useState<
    'import' | 'share' | 'export' | 'export-dialog' | false
  >(false)

  const searchParams = useMemo(() => {
    const searchParams = new URLSearchParams()
    searchParams.set('preset', selected.slug)
    expandPresetSearchParams(searchParams, hues)
    return searchParams
  }, [hues, selected.slug])

  return (
    <Card style={{ paddingLeft: 'env(safe-area-inset-left)' }}>
      <Card paddingX={[4]} paddingBottom={2}>
        <Label htmlFor="presets" size={0} muted>
          Presets
        </Label>
        <Card paddingY={2}>
          <MenuButton
            button={
              <Button
                fontSize={1}
                paddingY={2}
                paddingX={3}
                tone="default"
                mode="ghost"
                icon={selected.icon ?? iconFromSlug(selected.slug)}
                iconRight={SelectIcon}
                text={selected.title}
              />
            }
            id="presets"
            menu={
              <Menu>
                {presets.map((_preset) => {
                  const { slug, icon, title } = _preset
                  const active = selected.slug === slug
                  return (
                    <MenuItem
                      fontSize={1}
                      paddingY={2}
                      paddingX={3}
                      key={slug}
                      icon={icon ?? iconFromSlug(slug)}
                      text={title}
                      tone={active ? 'primary' : 'default'}
                      selected={active}
                      onClick={
                        active ? undefined : () => void onChange(_preset)
                      }
                    />
                  )
                })}
              </Menu>
            }
            placement="bottom-start"
            popover={{ portal: true }}
          />
        </Card>
      </Card>
      <Card paddingX={[4]} paddingBottom={2}>
        <Label size={0} muted>
          Tools
        </Label>
        <Card paddingY={2}>
          <TabList space={2}>
            <Tab
              fontSize={1}
              aria-controls="import-panel"
              icon={UploadIcon}
              id="import-tab"
              label="Import"
              onClick={() =>
                setOpen((open) => (open === 'import' ? false : 'import'))
              }
              selected={open === 'import'}
            />
            <Tab
              fontSize={1}
              aria-controls="share-panel"
              icon={PackageIcon}
              id="share-tab"
              label="Share"
              onClick={() =>
                setOpen((open) => (open === 'share' ? false : 'share'))
              }
              selected={open === 'share'}
            />
            <Tab
              fontSize={1}
              aria-controls="export-panel"
              icon={DownloadIcon}
              id="export-tab"
              label="Export"
              onClick={() =>
                setOpen((open) => (open === 'export' ? false : 'export'))
              }
              selected={open && open.startsWith('export')}
            />
          </TabList>
        </Card>
        <TabPanel
          aria-labelledby="import-tab"
          hidden={open !== 'import'}
          id="import-panel"
        >
          <Card marginY={2}>
            <ImportFromImage
              prepareTransition={prepareTransition}
              startTransition={startTransition}
              setPreset={setPreset}
              unstable_showParsedUrl={unstable_showParsedUrl}
            />
          </Card>
        </TabPanel>
        <TabPanel
          aria-labelledby="share=panel"
          hidden={open !== 'share'}
          id="share-panel"
        >
          <Card marginY={2}>
            <ShareTab searchParams={searchParams} />
          </Card>
        </TabPanel>
        <TabPanel
          aria-labelledby="export=panel"
          hidden={open ? !open.startsWith('export') : true}
          id="export-panel"
        >
          <Card marginY={2}>
            <ExportTheme
              searchParams={searchParams}
              open={open as 'export'}
              onOpen={() => setOpen('export-dialog')}
              onClose={() => setOpen('export')}
            />
          </Card>
        </TabPanel>
      </Card>
    </Card>
  )
}

export default memo(PresetsMenu)
