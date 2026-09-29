import { Card, Text, type ThemeColorSchemeKey } from '@sanity/ui'
import Logo from 'components/Logo'
import {
  memo,
  type TransitionStartFunction,
  useCallback,
  useState,
  useTransition,
} from 'react'
import { styled } from 'styled-components'

interface Props {
  scheme: ThemeColorSchemeKey
  spins: number
  transition: boolean
}
export const HeaderCard = memo(function HeaderCard({
  scheme,
  spins,
  transition,
}: Props) {
  return (
    <RootCard paddingLeft={[4]} scheme={scheme} borderBottom>
      <Card
        borderRight
        style={{
          display: 'grid',
          gridTemplateColumns: '32px 1fr',
          alignItems: 'center',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingTop: '7px', // To match navbar height
          paddingBottom: '7px',
        }}
      >
        <Logo scheme={scheme} spin={spins} transition={transition} />
        <Card paddingY={[3]} paddingX={[3]}>
          <Text weight="semibold" muted style={{ flex: 2 }}>
            Studio v3 Themer
          </Text>
        </Card>
      </Card>
    </RootCard>
  )
})

interface UseHeaderCard {
  spin: () => void
  spins: number
  transition: boolean
  startTransition: TransitionStartFunction
}
export const useHeaderCard = (): UseHeaderCard => {
  const [transition, startTransition] = useTransition()
  const [spins, setSpin] = useState(1)
  const spin = useCallback(
    () => startTransition(() => setSpin((spins) => ++spins)),
    [],
  )

  return {
    spins,
    spin,
    transition,
    startTransition,
  }
}

// @TODO find a better z-index than 101
const RootCard = styled(Card)`
  position: sticky;
  top: 0;
  z-index: 101;
`
