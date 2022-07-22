import { ShareIcon as _ShareIcon } from '@heroicons/react/outline'
import { ClipboardIcon, LockIcon } from '@sanity/icons'
import { Grid, Stack, useToast } from '@sanity/ui'
import { Button, Label } from 'components/Sidebar.styles'
import { memo, useLayoutEffect, useState } from 'react'
import styled from 'styled-components'
import { shortenPresetSearchParams } from 'utils/shortenPresetSearchParams'

const ShareIcon = styled(_ShareIcon)`
  transform: translateX(-1px);
  width: 16px;
  stroke-width: 1.4;
`

const title = 'Themer'
const text = 'Create Sanity Studio v3 Themes'

interface Props {
  searchParams: URLSearchParams
}
const ShareTab = ({ searchParams }: Props) => {
  const { push: pushToast } = useToast()
  const [canShare, setCanShare] = useState(false)

  useLayoutEffect(() => {
    if (navigator?.canShare?.({ title, text, url: location.href })) {
      setCanShare(true)
    }
  }, [])

  return (
    <Stack space={3}>
      <Stack space={2}>
        <Label>Share your theme with the world 💖</Label>
        <Grid columns={canShare ? 2 : 1} gap={2}>
          <Button
            icon={ClipboardIcon}
            text="Copy URL"
            onClick={() => {
              const params = new URLSearchParams(searchParams)
              shortenPresetSearchParams(params)
              if (params.get('preset') === 'default') {
                params.delete('preset')
              }
              navigator.clipboard.writeText(
                new URL(
                  `${location.pathname}?${decodeURIComponent(
                    params.toString()
                  )}`,
                  location.origin
                ).toString()
              )
              pushToast({
                closable: true,
                status: 'success',
                title: `The url is copied to the clipboard`,
              })
            }}
          />
          {canShare && (
            <Button
              tone="primary"
              icon={ShareIcon}
              text="Share URL"
              onClick={async () => {
                try {
                  const params = new URLSearchParams(searchParams)
                  shortenPresetSearchParams(params)
                  if (params.get('preset') === 'default') {
                    params.delete('preset')
                  }
                  await navigator.share({
                    title,
                    text,
                    url: new URL(
                      `${location.pathname}?${decodeURIComponent(
                        params.toString()
                      )}`,
                      location.origin
                    ).toString(),
                  })
                } catch {
                  // ignore for now
                }
              }}
            />
          )}
        </Grid>
      </Stack>
      <Stack space={2}>
        <Label>Pin your theme if it&#39;s finished 📌</Label>
        <Button
          title="Pinning your theme gives you an URL that will always return the same Theme, even if the preset you're extending changes your thene stays the same."
          icon={LockIcon}
          text="Copy pinned URL"
          onClick={() => {
            const params = new URLSearchParams(searchParams)
            if (!params.has('pin')) {
              params.set('pin', '1')
            }
            navigator.clipboard.writeText(
              new URL(
                `${location.pathname}?${decodeURIComponent(params.toString())}`,
                location.origin
              ).toString()
            )
            pushToast({
              closable: true,
              status: 'success',
              title: `The url is copied to the clipboard`,
            })
          }}
        />
      </Stack>
    </Stack>
  )
}

export default memo(ShareTab)
