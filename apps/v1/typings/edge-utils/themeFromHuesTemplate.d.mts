import type {Hues} from 'utils/types'

/**
 * Renders the ES module that `/api/hues` serves: the theme generated from
 * `hues`, with the `createTheme`, `hues` and `theme` exports.
 */
export declare function themeFromHuesTemplate(hues: Hues, minified: boolean): string
