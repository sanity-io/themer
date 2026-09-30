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

import fs from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

import esbuild from 'esbuild'

const resolveDir = path.resolve(fileURLToPath(import.meta.url), '../..')
/**
 * @type {import('esbuild').BuildOptions}
 **/
const _defaults = {
  bundle: true,
  format: 'esm',
  minifySyntax: true,
  outExtension: {'.js': '.mjs'},
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
import {createClient} from './node_modules/@sanity/client/dist/index.browser.js'
export {createClient}
    `,
      resolveDir,
      loader: 'ts',
    },
  })
}

// Production Studios import the theme modules `/api/hues` serves, so these
// have to stay byte-identical to what it has always served. Bundling them from
// node_modules can't guarantee that, since the versions and the pnpm layout it
// resolves change what esbuild emits, down to the paths the unminified build
// prints as comments. Never edit or regenerate them.
/** @param {string} file */
const readFrozenTemplate = (file) => fs.readFile(path.resolve(resolveDir, 'frozen', file), 'utf8')

const buildThemeFromHuesTemplate = async () => {
  const prebuiltFromEsbuild = await readFrozenTemplate('themeFromHues.mjs.txt')
  const minifiedPrebuiltFromEsbuild = await readFrozenTemplate('themeFromHues.min.mjs.txt')

  return esbuild.build({
    ...nodeDefaults,
    outfile: path.resolve(resolveDir, 'edge-utils/themeFromHuesTemplate.mjs'),
    stdin: {
      contents: `
import JSON5 from "json5/dist/index.mjs";

export function themeFromHuesTemplate(hues, minified) {
  const template = minified ? ${JSON.stringify(
    minifiedPrebuiltFromEsbuild,
  )} : ${JSON.stringify(prebuiltFromEsbuild)}
  const tip = minified ? ${JSON.stringify(
    '// Minified build, append `?min=0` for easier debugging',
  )} : ${JSON.stringify(
    '// Not minified, remove `?min=0` from the request for much smaller output',
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

// We need an edge-compatible version of the sanity client
await buildSanityClient()

// Now we build the util used by the edge APIs that outputs ESM that can by dynamically imported
await buildThemeFromHuesTemplate()
