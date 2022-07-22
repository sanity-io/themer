import {
  Card,
  Grid,
  Label as UiLabel,
  Stack,
  Text,
  TextInput,
} from '@sanity/ui'
import { DiceIcon } from 'components/icons'
import {
  SuspenseFallback,
  WarningMessage,
} from 'components/ImportFromImage.styles'
import ImportFromSanityImageAsset from 'components/ImportFromSanityImageAsset'
import { Button, Label } from 'components/Sidebar.styles'
import {
  type Dispatch,
  type SetStateAction,
  type TransitionStartFunction,
  memo,
  Suspense,
  useId,
  useMemo,
  useState,
} from 'react'
import type { ThemePreset } from 'utils/types'

const exampleUrls = [
  'https://cdn.sanity.io/images/32a3sayd/blog/22b33a9a6a7c1a964648e1e9ce1324791c7456dc-800x1000.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/c7df4bf5a0b43b3996aad56b6cecbfbc3579cb53-800x1198.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/e3cb45c3657161f8c807503854378f19d36f0b6f-800x1200.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/c7a1db2f16279c6cd8f06084bbc16fae565d8fb0-800x533.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/2ecda11edf9a8f31228a0d944fad07947b4ffb45-800x1120.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/0a9b72a57feb269c8726627115e96c85f737259c-800x1200.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/496b0071e4476e10c9b819bcc7f78ee4365984a8-3432x1930.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/994c6a38c71357af600e7d4856d5fd1340338f6c-2148x1611.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/4f620daa57c7b6e77a11e74773d75623a18dd3ed-988x1480.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/4f2786ac2fc878fffb06072c930036188215b830-987x1480.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/688bd8ab47f2ef7a3647ccd2a29259b9f7d699dc-2304x1570.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/527f3eb911895c4ecfb234f9ebb84d05beb17f00-2148x1611.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/1791546bccd135fecdeab02e80eda87a51eb3c26-1007x1437.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/c2403eff50ed690fc0318aa3c6fce1f61fd7b1cf-1365x1706.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/518e1beae2c184dbc529a09fdb336621ed94cc25-2370x1580.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/85c3188078597d7be257a70242bed27a39a02ad1-1341x1766.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/70719689a6a82ca4d99876bb9162514fb1816893-1338x1772.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/592d9f936a1b5eec29f7c366aa6d3b13f6b5a13b-987x1480.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/2f0b56cf226ba8958a60f27ce086e5b2b119d105-1365x1706.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/ed9d281435d528ab29e0d511f9c749db2ea0355a-927x1648.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/9786cb5659a8f8eb53130fa80ebe69a8e96d5e13-1365x1706.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/f5ae2314354c25127ceae1ecd2a05078e22feffd-987x1481.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/6ff2afa96a85de30453e183611c871063251b5b0-2228x1588.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/d8235db0201583b1652128387e0aca8269dac7f6-987x1481.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/f602aa7064c1302ea18fba273c8a2201b84fa5ef-987x1481.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/a7e3201605649b7abe2c44ac731bf1e6676fe7c8-2804x1621.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/ef85dd56f60645fe88f7aba6e9682638ac8208b7-987x1481.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/c8b69d44aaf924e84402e7864ddac48b05c0c037-2370x1580.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/c40801a963779b65184908233791806116065ec6-3432x1931.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/09ae973adc4668d2aaa9e43d862dafabadd9b711-3432x1931.png',
  'https://cdn.sanity.io/images/32a3sayd/blog/68b862974f21196f5a4417d0ad56190f4d612536-2128x1617.png',
]
const validationMessages = {
  patternMismatch: `Only Sanity Image URLs are supported`,
}

interface Props {
  startTransition: TransitionStartFunction
  setPreset: Dispatch<SetStateAction<ThemePreset>>
  prepareTransition: () => void
  unstable_showParsedUrl: boolean
}
function ImportFromImage({
  prepareTransition,
  startTransition,
  setPreset,
  unstable_showParsedUrl,
}: Props) {
  const urlInputId = useId()

  const [url, setUrl] = useState('')
  const [touched, setTouched] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const asset = useMemo(() => {
    try {
      const url = new URL(imageUrl)
      const [, , projectId, dataset, _id] = url.pathname.split('/')
      const id = `image-${_id.split('.').join('-')}`
      return { projectId, dataset, id }
    } catch {
      return { projectId: '', dataset: '', id: '' }
    }
  }, [imageUrl])

  return (
    <Stack space={3}>
      <Stack space={2}>
        <label htmlFor={urlInputId}>
          <Label>Image URL</Label>
        </label>
        <TextInput
          muted
          id={urlInputId}
          required={touched}
          type="url"
          placeholder="Paste image URL"
          pattern="^https://cdn.sanity.io/images/.+"
          fontSize={[2, 2, 1]}
          value={url}
          onFocus={(event) => {
            setTouched(false)
            event.target.setSelectionRange(0, event.target.value.length)
          }}
          onChange={(event) => {
            setUrl(event.currentTarget.value)
            prepareTransition()

            if (
              !event.currentTarget.checkValidity() ||
              !event.currentTarget.value
            ) {
              setImageUrl('')
              return
            }

            try {
              const parsed = new URL(event.currentTarget.value)
              if (
                parsed.origin !== 'https://cdn.sanity.io' ||
                !parsed.pathname.startsWith('/images/')
              ) {
                throw new Error(validationMessages.patternMismatch)
              }
              setImageUrl(parsed.toString())
              setValidationMessage('')
            } catch (err) {
              setValidationMessage(err.message)
              return
            }
          }}
          onInvalid={(event) => {
            event.preventDefault()
            if (event.currentTarget.validity.patternMismatch) {
              setValidationMessage(validationMessages.patternMismatch)
            } else {
              setValidationMessage(event.currentTarget.validationMessage)
            }
          }}
          onBlur={() => setTouched(true)}
        />
        {validationMessage && <WarningMessage message={validationMessage} />}
        <Button
          icon={<DiceIcon />}
          text="Random image"
          tone={imageUrl ? 'default' : 'primary'}
          onClick={() => {
            const exampleUrl =
              exampleUrls[~~(exampleUrls.length * Math.random())]
            setUrl(exampleUrl)
            setValidationMessage('')
            setImageUrl(exampleUrl)
          }}
        />
        {unstable_showParsedUrl && (
          <Card
            as="details"
            tone="transparent"
            muted
            radius={2}
            paddingX={2}
            paddingY={1}
          >
            <summary
              style={{
                position: 'relative',
                color: 'var(--card-muted-fg-color)',
              }}
            >
              <Text
                size={1}
                muted
                style={{
                  display: 'inline-block',
                  position: 'absolute',
                  top: '0.25rem',
                  left: '1rem',
                }}
              >
                Parsed URL
              </Text>
            </summary>
            <Stack space={1} paddingY={2}>
              <UiLabel size={0}>URL</UiLabel>
              <TextInput fontSize={0} readOnly value={imageUrl} />
              <Grid columns={2} paddingY={1} gap={1}>
                <Stack space={1}>
                  <UiLabel size={0}>Project ID</UiLabel>
                  <TextInput fontSize={0} readOnly value={asset.projectId} />
                </Stack>
                <Stack space={1}>
                  <UiLabel size={0}>Dataset</UiLabel>
                  <TextInput fontSize={0} readOnly value={asset.dataset} />
                </Stack>
              </Grid>
              <UiLabel size={0}>Image Asset Ref</UiLabel>
              <TextInput fontSize={0} readOnly value={asset.id} />
            </Stack>
          </Card>
        )}
      </Stack>
      {asset.projectId && asset.dataset && asset.id && (
        <Suspense fallback={<SuspenseFallback />}>
          <ImportFromSanityImageAsset
            projectId={asset.projectId}
            dataset={asset.dataset}
            id={asset.id}
            prepareTransition={prepareTransition}
            startTransition={startTransition}
            setPreset={setPreset}
          />
        </Suspense>
      )}
    </Stack>
  )
}

export default memo(ImportFromImage)
