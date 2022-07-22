import type { ColorTints } from '@sanity/color'
import type {
  PartialThemeColorBuilderOpts,
  ThemeColorSchemes,
  ThemeColorSpotKey,
} from '@sanity/ui'
import type { StudioTheme } from 'sanity'
import type { PartialDeep } from 'type-fest'
import { applyHues } from 'utils/applyHues'
import {
  blue,
  cyan,
  gray,
  green,
  magenta,
  NEUTRAL_TONES,
  orange,
  purple,
  red,
  yellow,
} from 'utils/colors'
import { createTonesFromHues } from 'utils/createTonesFromHues'
import type { Hues } from 'utils/types'

interface Options {
  hues: PartialDeep<Hues>
  // if there's a color property on the studioTheme it will be overridden/ignored, thus we change the typing allowing it to be omitted
  // but at the same time not _enforcing_ it to be omitted and create unnecessary TS errors for those passing `import {studioTheme} from '@sanity/ui'` directly
  studioTheme: Omit<StudioTheme, 'color'> & { color?: unknown }
  multiply: (bg: string, fg: string) => string
  screen: (bg: string, fg: string) => string
  rgba: (color: unknown, a: number) => string
  createColorTheme: (
    partialOpts: PartialThemeColorBuilderOpts
  ) => ThemeColorSchemes
}

function getTint(key: ThemeColorSpotKey): ColorTints {
  switch (key) {
    case 'blue':
      return blue
    case 'cyan':
      return cyan
    case 'gray':
      return gray
    case 'green':
      return green
    case 'magenta':
      return magenta
    case 'orange':
      return orange
    case 'purple':
      return purple
    case 'red':
      return red
    case 'yellow':
      return yellow
    default:
      throw new Error(`Unknown tint: ${key}`)
  }
}

export function themeFromHues({
  hues: partialHues,
  studioTheme,
  multiply,
  screen,
  rgba,
  createColorTheme,
}: Options): StudioTheme {
  const hues = applyHues(partialHues)
  // These variables are made top-level to keep the body of createColorTheme largely the same.
  // This makes it much easier to sync it with new releases of @sanity/ui should its implementation details change.
  const black = { title: 'Black', hex: hues.default.darkest }
  const white = { title: 'white', hex: hues.default.lightest }

  const tones = createTonesFromHues(hues)
  // @TODO: consider making these overridable as input
  const focusRingHue = tones.primary
  const accentHue = tones.critical
  const linkHue = tones.primary

  // Generate colors :OOO
  // Based on https://github.com/sanity-io/design/blob/804bf73dffb1c0ecb1c2e6758135784502768bfe/packages/%40sanity/ui/src/theme/studioTheme/color.ts#L6-L637
  const color = createColorTheme({
    base: ({ dark, name }) => {
      if (name === 'default') {
        const skeletonFrom = dark
          ? tones.transparent[900].hex
          : tones.transparent[100].hex

        return {
          // @TODO: consider making this overridable
          fg: dark ? white.hex : black.hex,
          // @TODO: consider making this overridable
          bg: dark ? black.hex : white.hex,
          // @TODO: consider making this overridable
          border: tones.transparent[dark ? 800 : 200].hex,
          focusRing: focusRingHue[dark ? 500 : 500].hex,
          shadow: {
            outline: rgba(tones.transparent[500].hex, 0.4),
            umbra: rgba(dark ? black.hex : tones.transparent[500].hex, 0.2),
            penumbra: rgba(dark ? black.hex : tones.transparent[500].hex, 0.14),
            ambient: rgba(dark ? black.hex : tones.transparent[500].hex, 0.12),
          },
          skeleton: {
            from: skeletonFrom,
            to: rgba(skeletonFrom, 0.5),
          },
        }
      }

      if (name === 'transparent') {
        const tints = tones.default
        const skeletonFrom = tints[dark ? 800 : 200].hex

        return {
          fg: tints[dark ? 100 : 900].hex,
          bg: tints[dark ? 950 : 50].hex,
          border: tints[dark ? 800 : 300].hex,
          focusRing: focusRingHue[500].hex,
          shadow: {
            outline: rgba(tints[500].hex, dark ? 0.2 : 0.4),
            umbra: rgba(dark ? black.hex : tints[500].hex, 0.2),
            penumbra: rgba(dark ? black.hex : tints[500].hex, 0.14),
            ambient: rgba(dark ? black.hex : tints[500].hex, 0.12),
          },
          skeleton: {
            from: skeletonFrom,
            to: rgba(skeletonFrom, 0.5),
          },
        }
      }

      const tints = tones[name] || tones.default
      const skeletonFrom = tints[dark ? 800 : 200].hex

      return {
        fg: tints[dark ? 100 : 900].hex,
        bg: tints[dark ? 950 : 50].hex,
        border: tints[dark ? 800 : 200].hex,
        focusRing: tints[500].hex,
        shadow: {
          outline: rgba(tints[500].hex, dark ? 0.2 : 0.4),
          umbra: rgba(dark ? black.hex : tints[500].hex, 0.2),
          penumbra: rgba(dark ? black.hex : tints[500].hex, 0.14),
          ambient: rgba(dark ? black.hex : tints[500].hex, 0.12),
        },
        skeleton: {
          from: skeletonFrom,
          to: rgba(skeletonFrom, 0.5),
        },
      }
    },

    solid: ({ base, dark, name, state, tone }) => {
      const mix = dark ? screen : multiply
      const mix2 = dark ? multiply : screen
      const defaultTints = tones[name] || tones.default
      const isNeutral =
        NEUTRAL_TONES.includes(name) && NEUTRAL_TONES.includes(tone)

      let tints = tones[tone === 'default' ? name : tone] || defaultTints

      if (state === 'disabled') {
        tints = defaultTints
        const bg = mix(base.bg, tints[dark ? 800 : 200].hex)
        const skeletonFrom = mix2(bg, tints[dark ? 200 : 800].hex)

        return {
          bg,
          bg2: mix2(bg, tints[dark ? 50 : 950].hex),
          border: mix(base.bg, tints[dark ? 800 : 200].hex),
          fg: mix(base.bg, dark ? black.hex : white.hex),
          muted: {
            fg: mix(base.bg, tints[dark ? 950 : 50].hex),
          },
          accent: {
            fg: mix(base.bg, tints[dark ? 950 : 50].hex),
          },
          link: {
            fg: mix(base.bg, tints[dark ? 950 : 50].hex),
          },
          code: {
            bg,
            fg: mix(base.bg, tints[dark ? 950 : 50].hex),
          },
          skeleton: {
            from: skeletonFrom,
            to: rgba(skeletonFrom, 0.5),
          },
        }
      }

      if (state === 'hovered') {
        const bg = mix(base.bg, tints[dark ? 300 : 600].hex)
        const skeletonFrom = mix2(bg, tints[dark ? 200 : 800].hex)

        return {
          bg,
          bg2: mix2(bg, tints[dark ? 50 : 950].hex),
          border: mix(base.bg, tints[dark ? 300 : 600].hex),
          fg: mix(base.bg, dark ? black.hex : white.hex),
          muted: {
            fg: mix(base.bg, tints[dark ? 800 : 200].hex),
          },
          accent: {
            fg: mix2(bg, accentHue[dark ? 800 : 200].hex),
          },
          link: {
            fg: mix2(bg, linkHue[dark ? 800 : 200].hex),
          },
          code: {
            bg: mix(bg, tints[dark ? 950 : 50].hex),
            fg: mix(base.bg, tints[dark ? 800 : 200].hex),
          },
          skeleton: {
            from: skeletonFrom,
            to: rgba(skeletonFrom, 0.5),
          },
        }
      }

      if (state === 'pressed') {
        const bg = mix(base.bg, tints[dark ? 200 : 800].hex)
        const skeletonFrom = mix2(bg, tints[dark ? 200 : 800].hex)

        return {
          bg: mix(base.bg, tints[dark ? 200 : 800].hex),
          bg2: mix2(bg, tints[dark ? 50 : 950].hex),
          border: mix(base.bg, tints[dark ? 200 : 800].hex),
          fg: mix(base.bg, dark ? black.hex : white.hex),
          muted: {
            fg: mix(base.bg, tints[dark ? 800 : 200].hex),
          },
          accent: {
            fg: mix2(bg, accentHue[dark ? 800 : 200].hex),
          },
          link: {
            fg: mix2(bg, linkHue[dark ? 800 : 200].hex),
          },
          code: {
            bg: mix(bg, tints[dark ? 950 : 50].hex),
            fg: mix(base.bg, tints[dark ? 800 : 200].hex),
          },
          skeleton: {
            from: skeletonFrom,
            to: rgba(skeletonFrom, 0.5),
          },
        }
      }

      if (state === 'selected') {
        if (isNeutral) {
          tints = tones.primary
        }

        const bg = mix(base.bg, tints[dark ? 200 : 800].hex)
        const skeletonFrom = mix2(bg, tints[dark ? 200 : 800].hex)

        return {
          bg,
          bg2: mix2(bg, tints[dark ? 50 : 950].hex),
          border: mix(base.bg, tints[dark ? 200 : 800].hex),
          fg: mix(base.bg, dark ? black.hex : white.hex),
          muted: {
            fg: mix(base.bg, tints[dark ? 800 : 200].hex),
          },
          accent: {
            fg: mix2(bg, accentHue[dark ? 800 : 200].hex),
          },
          link: {
            fg: mix2(bg, linkHue[dark ? 800 : 200].hex),
          },
          code: {
            bg: mix(bg, tints[dark ? 950 : 50].hex),
            fg: mix(base.bg, tints[dark ? 800 : 200].hex),
          },
          skeleton: {
            from: skeletonFrom,
            to: rgba(skeletonFrom, 0.5),
          },
        }
      }

      // state: "enabled" | unknown
      const bg = mix(base.bg, tints[dark ? 400 : 500].hex)
      const skeletonFrom = mix2(bg, tints[dark ? 200 : 800].hex)

      return {
        bg,
        bg2: mix2(bg, tints[dark ? 50 : 950].hex),
        border: mix(base.bg, tints[dark ? 400 : 500].hex),
        fg: mix(base.bg, dark ? black.hex : white.hex),
        muted: {
          fg: mix(base.bg, tints[dark ? 900 : 100].hex),
        },
        accent: {
          fg: mix2(bg, accentHue[dark ? 900 : 100].hex),
        },
        link: {
          fg: mix2(bg, linkHue[dark ? 900 : 100].hex),
        },
        code: {
          bg: mix(bg, tints[dark ? 950 : 50].hex),
          fg: mix(base.bg, tints[dark ? 900 : 100].hex),
        },
        skeleton: {
          from: skeletonFrom,
          to: rgba(skeletonFrom, 0.5),
        },
      }
    },

    muted: ({ base, dark, name, state, tone }) => {
      const mix = dark ? screen : multiply
      const defaultTints = tones[name] || tones.default
      const isNeutral =
        NEUTRAL_TONES.includes(name) && NEUTRAL_TONES.includes(tone)

      let tints = tones[tone === 'default' ? name : tone] || defaultTints

      if (state === 'disabled') {
        tints = defaultTints

        const bg = base.bg
        const skeletonFrom = mix(bg, tints[dark ? 900 : 100].hex)

        return {
          bg,
          bg2: mix(bg, tints[dark ? 950 : 50].hex),
          border: mix(bg, tints[dark ? 950 : 50].hex),
          fg: mix(bg, tints[dark ? 800 : 200].hex),
          muted: {
            fg: mix(bg, tints[dark ? 900 : 100].hex),
          },
          accent: {
            fg: mix(bg, tints[dark ? 900 : 100].hex),
          },
          link: {
            fg: mix(bg, tints[dark ? 900 : 100].hex),
          },
          code: {
            bg,
            fg: mix(bg, tints[dark ? 900 : 100].hex),
          },
          skeleton: {
            from: rgba(skeletonFrom, 0.5),
            to: rgba(skeletonFrom, 0.25),
          },
        }
      }

      if (state === 'hovered') {
        if (isNeutral) {
          tints = tones.primary
        }

        const bg = mix(base.bg, tints[dark ? 950 : 50].hex)
        const skeletonFrom = mix(bg, tints[dark ? 900 : 100].hex)

        return {
          bg,
          bg2: mix(bg, tints[dark ? 950 : 50].hex),
          border: mix(bg, tints[dark ? 900 : 100].hex),
          fg: mix(base.bg, tints[dark ? 200 : 800].hex),
          muted: {
            fg: mix(base.bg, tints[dark ? 400 : 600].hex),
          },
          accent: {
            fg: mix(base.bg, linkHue[dark ? 400 : 500].hex),
          },
          link: {
            fg: mix(base.bg, linkHue[dark ? 400 : 600].hex),
          },
          code: {
            bg: mix(bg, tints[dark ? 950 : 50].hex),
            fg: mix(base.bg, tints[dark ? 400 : 600].hex),
          },
          skeleton: {
            from: skeletonFrom,
            to: rgba(skeletonFrom, 0.5),
          },
        }
      }

      if (state === 'pressed') {
        if (isNeutral) {
          tints = tones.primary
        }

        const bg = mix(base.bg, tints[dark ? 900 : 100].hex)
        const skeletonFrom = mix(bg, tints[dark ? 900 : 100].hex)

        return {
          bg,
          bg2: mix(bg, tints[dark ? 950 : 50].hex),
          border: mix(bg, tints[dark ? 900 : 100].hex),
          fg: mix(base.bg, tints[dark ? 200 : 800].hex),
          muted: {
            fg: mix(base.bg, tints[dark ? 400 : 600].hex),
          },
          accent: {
            fg: mix(bg, accentHue[dark ? 400 : 500].hex),
          },
          link: {
            fg: mix(bg, linkHue[dark ? 400 : 600].hex),
          },
          code: {
            bg: mix(bg, tints[dark ? 950 : 50].hex),
            fg: mix(base.bg, tints[dark ? 400 : 600].hex),
          },
          skeleton: {
            from: skeletonFrom,
            to: rgba(skeletonFrom, 0.5),
          },
        }
      }

      if (state === 'selected') {
        if (isNeutral) {
          tints = tones.primary
        }

        const bg = mix(base.bg, tints[dark ? 900 : 100].hex)
        const skeletonFrom = mix(bg, tints[dark ? 900 : 100].hex)

        return {
          bg,
          bg2: mix(bg, tints[dark ? 950 : 50].hex),
          border: mix(bg, tints[dark ? 900 : 100].hex),
          fg: mix(base.bg, tints[dark ? 200 : 800].hex),
          muted: {
            fg: mix(base.bg, tints[dark ? 400 : 600].hex),
          },
          accent: {
            fg: mix(bg, accentHue[dark ? 400 : 500].hex),
          },
          link: {
            fg: mix(bg, linkHue[dark ? 400 : 600].hex),
          },
          code: {
            bg: mix(bg, tints[dark ? 950 : 50].hex),
            fg: mix(base.bg, tints[dark ? 400 : 600].hex),
          },
          skeleton: {
            from: skeletonFrom,
            to: rgba(skeletonFrom, 0.5),
          },
        }
      }

      const bg = base.bg
      const skeletonFrom = mix(bg, tints[dark ? 900 : 100].hex)

      return {
        bg,
        bg2: mix(bg, tints[dark ? 950 : 50].hex),
        border: mix(bg, tints[dark ? 900 : 100].hex),
        fg: mix(base.bg, tints[dark ? 300 : 700].hex),
        muted: {
          fg: mix(base.bg, tints[dark ? 400 : 600].hex),
        },
        accent: {
          fg: mix(base.bg, accentHue[dark ? 400 : 500].hex),
        },
        link: {
          fg: mix(base.bg, linkHue[dark ? 400 : 600].hex),
        },
        code: {
          bg: mix(base.bg, tints[dark ? 950 : 50].hex),
          fg: mix(base.bg, tints[dark ? 400 : 600].hex),
        },
        skeleton: {
          from: skeletonFrom,
          to: rgba(skeletonFrom, 0.5),
        },
      }
    },

    button: ({ base, mode, muted, solid }) => {
      if (mode === 'bleed') {
        return {
          enabled: {
            ...muted.enabled,
            border: muted.enabled.bg,
          },
          hovered: {
            ...muted.hovered,
            border: muted.hovered.bg,
          },
          pressed: {
            ...muted.pressed,
            border: muted.pressed.bg,
          },
          selected: {
            ...muted.selected,
            border: muted.selected.bg,
          },
          disabled: {
            ...muted.disabled,
            border: muted.disabled.bg,
          },
        }
      }

      if (mode === 'ghost') {
        return {
          ...solid,
          enabled: {
            ...muted.enabled,
            border: base.border,
          },
          disabled: muted.disabled,
        }
      }

      return solid
    },

    card: ({ base, dark, muted, name, solid, state }) => {
      if (state === 'hovered') {
        return muted[name].hovered
      }

      if (state === 'disabled') {
        return muted[name].disabled
      }

      const isNeutral = NEUTRAL_TONES.includes(name)
      const tints = tones[name] || tones.default
      const mix = dark ? screen : multiply

      if (state === 'pressed') {
        if (isNeutral) {
          return muted.primary.pressed
        }

        return muted[name].pressed
      }

      if (state === 'selected') {
        if (isNeutral) {
          return solid.primary.enabled
        }

        return solid[name].enabled
      }

      const bg = base.bg
      const skeletonFrom = mix(base.bg, tints[dark ? 900 : 100].hex)

      return {
        bg,
        bg2: mix(bg, tints[dark ? 950 : 50].hex),
        fg: base.fg,
        border: base.border,
        muted: {
          fg: mix(base.bg, tints[dark ? 400 : 600].hex),
        },
        accent: {
          fg: mix(base.bg, red[dark ? 400 : 500].hex),
        },
        link: {
          fg: mix(base.bg, blue[dark ? 400 : 600].hex),
        },
        code: {
          bg: mix(base.bg, tints[dark ? 950 : 50].hex),
          fg: tints[dark ? 400 : 600].hex,
        },
        skeleton: {
          from: skeletonFrom,
          to: rgba(skeletonFrom, 0.5),
        },
      }
    },

    input: ({ base, dark, mode, state }) => {
      const mix = dark ? screen : multiply

      if (mode === 'invalid') {
        const tints = tones.critical

        return {
          bg: mix(base.bg, tints[dark ? 950 : 50].hex),
          fg: mix(base.bg, tints[dark ? 400 : 600].hex),
          border: mix(base.bg, tints[dark ? 800 : 200].hex),
          placeholder: mix(base.bg, tints[dark ? 600 : 400].hex),
        }
      }

      if (state === 'hovered') {
        return {
          bg: base.bg,
          fg: base.fg,
          border: mix(base.bg, gray[dark ? 700 : 300].hex),
          placeholder: mix(base.bg, gray[dark ? 600 : 400].hex),
        }
      }

      if (state === 'disabled') {
        return {
          bg: mix(base.bg, gray[dark ? 950 : 50].hex),
          fg: mix(base.bg, gray[dark ? 700 : 300].hex),
          border: mix(base.bg, gray[dark ? 900 : 100].hex),
          placeholder: mix(base.bg, gray[dark ? 800 : 200].hex),
        }
      }

      if (state === 'readOnly') {
        return {
          bg: mix(base.bg, gray[dark ? 950 : 50].hex),
          fg: mix(base.bg, gray[dark ? 200 : 800].hex),
          border: mix(base.bg, gray[dark ? 800 : 200].hex),
          placeholder: mix(base.bg, gray[dark ? 600 : 400].hex),
        }
      }

      return {
        bg: base.bg,
        fg: base.fg,
        border: base.border,
        placeholder: mix(base.bg, gray[dark ? 600 : 400].hex),
      }
    },

    selectable: ({ base, muted, tone, solid, state }) => {
      if (state === 'enabled') {
        return {
          ...muted[tone].enabled,
          bg: base.bg,
        }
      }

      if (state === 'pressed') {
        if (tone === 'default') {
          return muted.primary.pressed
        }

        return muted[tone].pressed
      }

      if (state === 'selected') {
        if (tone === 'default') {
          return solid.primary.enabled
        }

        return solid[tone].enabled
      }

      if (state === 'disabled') {
        return {
          ...muted[tone].disabled,
          bg: base.bg,
        }
      }

      return muted[tone][state]
    },

    spot: ({ base, dark, key }) => {
      const mix = dark ? screen : multiply

      return mix(base.bg, getTint(key)[dark ? 400 : 500].hex)
    },

    syntax: ({ base, dark }) => {
      const mix = dark ? screen : multiply
      const mainShade = dark ? 400 : 600
      const secondaryShade = dark ? 600 : 400

      return {
        atrule: mix(base.bg, purple[mainShade].hex),
        attrName: mix(base.bg, green[mainShade].hex),
        attrValue: mix(base.bg, yellow[mainShade].hex),
        attribute: mix(base.bg, yellow[mainShade].hex),
        boolean: mix(base.bg, purple[mainShade].hex),
        builtin: mix(base.bg, purple[mainShade].hex),
        cdata: mix(base.bg, yellow[mainShade].hex),
        char: mix(base.bg, yellow[mainShade].hex),
        class: mix(base.bg, orange[mainShade].hex),
        className: mix(base.bg, cyan[mainShade].hex),
        comment: mix(base.bg, gray[secondaryShade].hex),
        constant: mix(base.bg, purple[mainShade].hex),
        deleted: mix(base.bg, red[mainShade].hex),
        doctype: mix(base.bg, gray[secondaryShade].hex),
        entity: mix(base.bg, red[mainShade].hex),
        function: mix(base.bg, green[mainShade].hex),
        hexcode: mix(base.bg, blue[mainShade].hex),
        id: mix(base.bg, purple[mainShade].hex),
        important: mix(base.bg, purple[mainShade].hex),
        inserted: mix(base.bg, yellow[mainShade].hex),
        keyword: mix(base.bg, magenta[mainShade].hex),
        number: mix(base.bg, purple[mainShade].hex),
        operator: mix(base.bg, magenta[mainShade].hex),
        prolog: mix(base.bg, gray[secondaryShade].hex),
        property: mix(base.bg, blue[mainShade].hex),
        pseudoClass: mix(base.bg, yellow[mainShade].hex),
        pseudoElement: mix(base.bg, yellow[mainShade].hex),
        punctuation: mix(base.bg, gray[mainShade].hex),
        regex: mix(base.bg, blue[mainShade].hex),
        selector: mix(base.bg, red[mainShade].hex),
        string: mix(base.bg, yellow[mainShade].hex),
        symbol: mix(base.bg, purple[mainShade].hex),
        tag: mix(base.bg, red[mainShade].hex),
        unit: mix(base.bg, orange[mainShade].hex),
        url: mix(base.bg, red[mainShade].hex),
        variable: mix(base.bg, red[mainShade].hex),
      }
    },
  })

  return { ...studioTheme, color }
}
