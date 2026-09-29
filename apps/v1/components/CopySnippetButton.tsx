import { ClipboardIcon } from '@sanity/icons'
import { useToast } from '@sanity/ui'
import { Button } from 'components/Sidebar.styles'
import { type ReactNode } from 'react'

interface Props {
  text: ReactNode
  code: string
  toastTitle: string
}
export default function CopySnippetButton({ text, code, toastTitle }: Props) {
  const { push: pushToast } = useToast()

  return (
    <Button
      icon={ClipboardIcon}
      text={text}
      onClick={() => {
        navigator.clipboard.writeText(code)
        pushToast({
          closable: true,
          status: 'success',
          title: toastTitle,
        })
      }}
    />
  )
}
