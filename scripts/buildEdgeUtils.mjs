// @ts-check
// Builds the utils used by edge APIs, which are super fast but severely limited and can't use most node modules directly
// I've already tried to run esbuild-wasm on the edge but I failed in the end with a
/*
[Error: panic: interface conversion: interface {} is map[string]interface {}, not []interface {}

debug.Stack (runtime/debug/stack.go:24)
helpers.PrettyPrintedStack (internal/helpers/stack.go:9)
main.(*serviceType).handleIncomingPacket.func1 (cmd/esbuild/service.go:220)
panic (runtime/panic.go:838)
main.(*serviceType).handleTransformRequest (cmd/esbuild/service.go:924)
main.(*serviceType).handleIncomingPacket (cmd/esbuild/service.go:236)
main.runService.func3 (cmd/esbuild/service.go:163)
created by main.runService (cmd/esbuild/service.go:162)]
*/
// Maybe revisit this later if it becomes possible to run something like esbuild on the edge
// https://github.com/stipsan/cv.cocody.dev/commit/afef6d2f2b96d38b402bc697b2191055f1a47bac#diff-fccff48487849dc062605deb0ddfffdc8702c1c90fdd65f22b257b69b254edb1

// @TODO use stdout instead of using a temp file as proxy

import esbuild from 'esbuild'
import { replace } from 'esbuild-plugin-replace'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const resolveDir = path.resolve(fileURLToPath(import.meta.url), '../..')
/**
 * @type {import('esbuild').BuildOptions}
 **/
const _defaults = {
  bundle: true,
  format: 'esm',
  minifySyntax: true,
  outExtension: { '.js': '.mjs' },
}
/**
 * @type {import('esbuild').BuildOptions}
 **/
const browserDefaults = {
  ..._defaults,
  // Target browsers that can use dynamic imports
  // https://caniuse.com/es6-module-dynamic-import
  target: ['chrome63', 'firefox67', 'safari12'],
  platform: 'browser',
  // @TODO figure out how to support source maps
  // sourcemap: 'external',
  plugins: [
    replace({
      include: /@sanity\/ui\/src\/theme\/studioTheme\/theme\.ts$/,
      delimiters: ['', ''],
      values: {
        'color,': '',
      },
    }),
  ],
}
let target = 'node16'
try {
  const major = process.version.replace(/^v/, '').split('.')[0]
  target = `node${major}`
  console.log(`Detected ${target}`)
} catch {
  console.log(`Failed to detect node version, setting target to ${target}`)
}
/**
 * @type {import('esbuild').BuildOptions}
 **/
const nodeDefaults = {
  ..._defaults,
  target,
  platform: 'node',
}

const buildTemplateString = async () => {
  /**
   * @type {import('esbuild').BuildOptions['stdin']}
   **/
  const stdin = {
    contents: `
  import {studioTheme} from './node_modules/@sanity/ui/src/theme/studioTheme/theme.ts'
  import {themeFromHues} from 'utils/themeFromHues'
  import {
    multiply as _multiply,
    parseColor,
    rgbToHex,
    screen as _screen,
    rgba,
  } from './node_modules/@sanity/ui/src/theme/lib/color-fns/index.ts'
  import {createColorTheme} from './node_modules/@sanity/ui/src/theme/lib/theme/color/factory.ts'
  
  function multiply(bg: string, fg: string): string {
    const b = parseColor(bg)
    const s = parseColor(fg)
    const hex = rgbToHex(_multiply(b, s))
  
    return hex
  }
  
  function screen(bg: string, fg: string): string {
    const b = parseColor(bg)
    const s = parseColor(fg)
    const hex = rgbToHex(_screen(b, s))
  
    return hex
  }

export const hues = process.env.__HUES__
  
export const createTheme = (_hues) => themeFromHues({
  hues: _hues, 
  studioTheme,
  multiply,
  screen,
  rgba,
  createColorTheme,
})

export const theme = createTheme(hues)
  `,
    resolveDir,
    loader: 'ts',
  }

  await esbuild.build({
    ...browserDefaults,
    minify: false,
    outfile: path.resolve(resolveDir, 'edge-utils/themeFromHues.mjs'),
    stdin,
  })
  await esbuild.build({
    ...browserDefaults,
    minify: true,
    outfile: path.resolve(resolveDir, 'edge-utils/themeFromHues.min.mjs'),
    stdin,
  })
}

const buildSanityClient = async () => {
  /**
   * @type {import('esbuild').BuildOptions['stdin']}
   **/

  await esbuild.build({
    ...browserDefaults,
    outfile: path.resolve(resolveDir, 'edge-utils/sanityClient.mjs'),
    stdin: {
      contents: `
globalThis.exports = {};
import createClient from './node_modules/@sanity/client/dist/sanityClient.browser.mjs'
export {createClient}
    `,
      resolveDir,
      loader: 'ts',
    },
  })
}

const buildThemeFromHuesTemplate = async () => {
  const prebuiltFromEsbuild = await fs.readFile(
    path.resolve(resolveDir, 'edge-utils/themeFromHues.mjs'),
    'utf8'
  )
  const minifiedPrebuiltFromEsbuild = await fs.readFile(
    path.resolve(resolveDir, 'edge-utils/themeFromHues.min.mjs'),
    'utf8'
  )

  return esbuild.build({
    ...nodeDefaults,
    outfile: path.resolve(resolveDir, 'edge-utils/themeFromHuesTemplate.mjs'),
    stdin: {
      contents: `
import JSON5 from "json5/dist/index.mjs";

export function themeFromHuesTemplate(hues, minified) {
  const template = minified ? ${JSON.stringify(
    minifiedPrebuiltFromEsbuild
  )} : ${JSON.stringify(prebuiltFromEsbuild)}
  const tip = minified ? ${JSON.stringify(
    '// Minified build, remove `?min` for easier debugging'
  )} : ${JSON.stringify(
        '// Not minified, append `?min` to the request for much smaller output'
      )}
  return "// Generated " + new Date().toJSON() + "\\n" + tip + "\\n\\n" + template.replace(
    'process.env.__HUES__',
    JSON5.stringify(hues, null, minified ? 0 : 2),
  )
}
`,
      resolveDir,
    },
  })
}

// Start by building the contents of the template string
await buildTemplateString()

// Next we need an edge-compatible version of the sanity client
await buildSanityClient()

// Now we build the util used by the edge APIs that outputs ESM that can by dynamically imported
await buildThemeFromHuesTemplate()
