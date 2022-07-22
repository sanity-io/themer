import { ClipboardIcon } from '@sanity/icons'
import { type CodeProps, Box, Button, Card, Code } from '@sanity/ui'
import { useToast } from '@sanity/ui'
import { memo } from 'react'
import styled from 'styled-components'

const StyledCode = styled(Code)`
  padding-right: 2rem;
  width: fit-content;
`

const StyledCard = styled(Card)`
  position: relative;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  max-height: 50vh;
  max-height: 50dvh;
`

const StyledBox = styled(Box)`
  position: relative;
`

const Tools = styled(Card)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
`

interface Props {
  children: string
  toastTitle?: string
  language?: CodeProps['language']
}
const CodeSnippet = ({
  children,
  toastTitle = 'Copied code to clipboard',
  language = 'ts',
}: Props) => {
  const { push: pushToast } = useToast()

  return (
    <StyledBox>
      <Tools margin={2} radius={2}>
        <Button
          mode="ghost"
          tone="default"
          aria-label="Copy code to clipboard"
          icon={ClipboardIcon}
          onClick={() => {
            navigator.clipboard.writeText(children)
            pushToast({
              closable: true,
              status: 'success',
              title: toastTitle,
            })
          }}
        />
      </Tools>
      <StyledCard
        overflow="auto"
        tone="transparent"
        padding={4}
        radius={2}
        shadow={1}
      >
        <StyledCode language={language}>{children}</StyledCode>
      </StyledCard>
    </StyledBox>
  )
}

export default memo(CodeSnippet)
