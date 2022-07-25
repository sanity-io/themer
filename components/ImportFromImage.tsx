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
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/f9cd353bf3077c93cadb2bc7eddcf5b9bfa8cfc9-2000x2666.jpg',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/994c6a38c71357af600e7d4856d5fd1340338f6c-2148x1611.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/e3cb45c3657161f8c807503854378f19d36f0b6f-800x1200.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/e52c39694a7d2436f2687d3a80589dee894a16cd-800x533.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/c7a1db2f16279c6cd8f06084bbc16fae565d8fb0-800x533.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/0a9b72a57feb269c8726627115e96c85f737259c-800x1200.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/4f2786ac2fc878fffb06072c930036188215b830-987x1480.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/22b33a9a6a7c1a964648e1e9ce1324791c7456dc-800x1000.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/688bd8ab47f2ef7a3647ccd2a29259b9f7d699dc-2304x1570.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/c7df4bf5a0b43b3996aad56b6cecbfbc3579cb53-800x1198.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/4f620daa57c7b6e77a11e74773d75623a18dd3ed-988x1480.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/2ecda11edf9a8f31228a0d944fad07947b4ffb45-800x1120.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/943d7e10ee953baac50b56da07898ef20d848262-800x1185.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/229f71c1f0cef3bc09d0fdfc3822b28f066ec787-1335x1780.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/8557479118298e8a1db3d9208e3957f15436e1a3-985x1485.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/f5ae2314354c25127ceae1ecd2a05078e22feffd-987x1481.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/e0eda8f4d7e9ce4d063a4e95d3a4b60a99ebde55-987x1481.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/edd7c1798cccaa3395181619acbc21043569ec23-987x1480.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/f9cd353bf3077c93cadb2bc7eddcf5b9bfa8cfc9-2000x2666.jpg',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/527f3eb911895c4ecfb234f9ebb84d05beb17f00-2148x1611.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/ea60fc35622ae82496a869bfcf30a7f61ae876cb-1364x1705.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/70719689a6a82ca4d99876bb9162514fb1816893-1338x1772.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/6ff2afa96a85de30453e183611c871063251b5b0-2228x1588.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/f9998557d346de2ce9d0f93183c59450b5f3ceff-2370x1580.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/05393b95dd3f1dbe14a2ba229b1eba4e828d4db7-987x1481.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/3ce358b5e2f173a5f790290cd3e60be14844ca30-800x533.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/3422c40ecc693314511969e1efba44641bc48aae-1896x1580.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/2f0b56cf226ba8958a60f27ce086e5b2b119d105-1365x1706.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/518e1beae2c184dbc529a09fdb336621ed94cc25-2370x1580.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/4fd1e44f9d2fce49babace8e5813b720b7fb4a7d-927x1648.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/0a5e21eb02001a0094546c7bdf83c1bd6ee9999d-2370x1580.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/d8235db0201583b1652128387e0aca8269dac7f6-987x1481.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/7ecc4e2f10f43f72b91ec7ee61bb2d0fff4cf2b5-800x533.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/2117c67f1edd613b31b6a6d43f514337d6c5f2ee-2370x1581.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/f0a9b85f3e343be2dc66fac9058f3bfb472619a4-927x1648.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/a4ce112afe805ead7338b8f47214ce21293370e4-1002x1447.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/ba4c75f0f7fb39cb6f82d55ab5a74c2c35b342c4-3432x1931.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/b9e02e177fd75cb49cc3bc40f6dcea5060782fc3-1015x1421.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/1791546bccd135fecdeab02e80eda87a51eb3c26-1007x1437.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/09ae973adc4668d2aaa9e43d862dafabadd9b711-3432x1931.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/c8b69d44aaf924e84402e7864ddac48b05c0c037-2370x1580.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/ed9d281435d528ab29e0d511f9c749db2ea0355a-927x1648.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/125133b7ba6ad47223269b1aa434ef8ded2df6e0-987x1481.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/ae10c1cc2235916e8a77ffc8accebb44e7b869e3-3387x5081.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/622357e771689143bd40865d7a0bb28791df8610-987x1481.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/814eec39dd13450026109c71356c097de2355db6-987x1482.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/2cb19cb7df45ed7ff2c11dbdb7d8a769c7ad6200-927x1648.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/ab86089ea4919df800ee21ec22ab89e192339101-1336x1781.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/68b862974f21196f5a4417d0ad56190f4d612536-2128x1617.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/029743866f32b6a51e261ba6f53bde50aaa49342-3432x1931.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/f602aa7064c1302ea18fba273c8a2201b84fa5ef-987x1481.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/a7e3201605649b7abe2c44ac731bf1e6676fe7c8-2804x1621.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/67bd5204ac055c784e258a4cee17c48616cfbbf8-800x1200.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/14e31cb161ce2c2d9a61fd4915095b4932f7002c-800x1120.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/82491092f3e4fffc84c0c56f74fd2ddbf2a144b8-2393x1555.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/ea528af16ee19b099d968be26d0c1a0c934f2233-1015x1421.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/4398e4160d06487e008914ce7a444c3871ac6beb-800x1200.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/ef85dd56f60645fe88f7aba6e9682638ac8208b7-987x1481.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/b7c43aa24145f9367b895100c82e1e11a1952235-927x1647.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/c40801a963779b65184908233791806116065ec6-3432x1931.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/5f15f4f225dd7ca47d28bf39aa9a357f6cc079fa-2312x1568.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/ea3c410f9d137694aded9301ed2ec78aaeb72c88-1480x1480.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/f940be9a40ce6eab57bd8c29276c3f843bbca393-927x1648.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/df1bb5970386b733a06d9a2ea25d226a2dd5e8f4-2370x1580.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/592d9f936a1b5eec29f7c366aa6d3b13f6b5a13b-987x1480.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/74dab72e1b46a52ae2ae712c5c068bc457f38b7f-987x1481.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/9786cb5659a8f8eb53130fa80ebe69a8e96d5e13-1365x1706.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/f435ce3a3066399388f1d28861b90ce6ff2713f3-3431x1930.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/5d0b85992359fb82f8db4ea20daee03b4912d116-987x1481.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/85c3188078597d7be257a70242bed27a39a02ad1-1341x1766.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/a0b9beaf2fea09730ee33a6e7b7bf6fec811cecb-800x529.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/c2403eff50ed690fc0318aa3c6fce1f61fd7b1cf-1365x1706.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/6de31c97f8d6b4dd10ccdb1c650241bd3e10f8e7-3432x1931.png',
  'https://cdn.sanity.io/images/c8jibo38/themer-blog/496b0071e4476e10c9b819bcc7f78ee4365984a8-3432x1930.png',
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
  const [demos, setDemos] = useState(exampleUrls)

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
            const exampleUrl = demos[~~(demos.length * Math.random())]
            setDemos((demos) => {
              if (demos.length === 1) {
                return exampleUrls
              }
              return demos.filter((url) => url !== exampleUrl)
            })
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
