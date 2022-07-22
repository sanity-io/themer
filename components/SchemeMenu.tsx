import { DesktopIcon, MoonIcon, SelectIcon, SunIcon } from '@sanity/icons'
import {
  type ThemeColorSchemeKey,
  Button,
  Card,
  Label,
  Menu,
  MenuButton,
  MenuItem,
} from '@sanity/ui'
import {
  type Dispatch,
  type SetStateAction,
  type TransitionStartFunction,
  memo,
  useCallback,
  useState,
} from 'react'

interface Props {
  forceScheme: ThemeColorSchemeKey
  setForceScheme: Dispatch<SetStateAction<ThemeColorSchemeKey>>
  startTransition: TransitionStartFunction
}
const SchemeMenu = ({
  forceScheme,
  startTransition,
  setForceScheme,
}: Props) => {
  const [scheme, setScheme] = useState<ThemeColorSchemeKey>(forceScheme)
  const updateScheme = useCallback(
    (nextScheme: ThemeColorSchemeKey) => {
      setScheme(nextScheme)
      startTransition(() => setForceScheme(nextScheme))
    },
    [setForceScheme, startTransition]
  )
  return (
    <>
      <Label htmlFor="scheme" size={0} muted>
        Scheme
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
              icon={
                scheme === 'light'
                  ? SunIcon
                  : scheme === 'dark'
                  ? MoonIcon
                  : DesktopIcon
              }
              iconRight={SelectIcon}
              text={
                scheme === 'light'
                  ? 'Light'
                  : scheme === 'dark'
                  ? 'Dark'
                  : 'System'
              }
            />
          }
          id="scheme"
          menu={
            <Menu>
              <MenuItem
                fontSize={1}
                paddingY={2}
                paddingX={3}
                icon={DesktopIcon}
                text="System"
                selected={scheme === null}
                tone={scheme === null ? 'primary' : 'default'}
                onClick={() => updateScheme(null)}
              />
              <MenuItem
                fontSize={1}
                paddingY={2}
                paddingX={3}
                icon={SunIcon}
                text="Light"
                selected={scheme === 'light'}
                tone={scheme === 'light' ? 'primary' : 'default'}
                onClick={() => updateScheme('light')}
              />
              <MenuItem
                fontSize={1}
                paddingY={2}
                paddingX={3}
                icon={MoonIcon}
                text="Dark"
                selected={scheme === 'dark'}
                tone={scheme === 'dark' ? 'primary' : 'default'}
                onClick={() => updateScheme('dark')}
              />
            </Menu>
          }
          placement="bottom-start"
          popover={{ portal: true }}
        />
      </Card>
    </>
  )
}

export default memo(SchemeMenu)
