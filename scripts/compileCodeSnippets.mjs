// @ts-check
// Compiles snippets so they have prettier formatting pre-applied

import JSON5 from 'json5'
import parserBabel from 'prettier/esm/parser-babel.mjs'
import parserTypescript from 'prettier/esm/parser-typescript.mjs'
import prettier from 'prettier/esm/standalone.mjs'
import writeFileAtomic from 'write-file-atomic'

const options = {
  arrowParens: 'avoid',
  bracketSpacing: false,
  parser: 'typescript',
  plugins: [parserTypescript],
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
}
const jsonOptions = {
  bracketSpacing: false,
  parser: 'json',
  plugins: [parserBabel],
  printWidth: 100,
}

const args = ['first', 'second']
const dummies = {
  esmUrl: `/* @dummy */ ${JSON5.stringify('https://example.com/api/hues')}`,
  themeConfigProperty: '/* @dummy */ theme,',
  import: `/* @dummy */
import {studioTheme as theme} from '@sanity/ui'`,
}

const snippets = [
  [
    'import-dynamic-js',
    ['esmUrl'],
    `
const {theme} = await import(${dummies.esmUrl})
`,
  ],
  [
    'import-dynamic-ts',
    ['esmUrl'],
    `
    const { theme } = (await import(
      // @ts-${'expect'}-error -- TODO setup themer.d.ts to get correct typings
      ${dummies.esmUrl}
    )) as { theme: import('sanity').StudioTheme }
`,
  ],
  [
    'import-static',
    ['esmUrl'],
    `
  import { theme } from ${dummies.esmUrl};
`,
  ],
  [
    'studio-config',
    ['import'],
    `
    // Add two lines of code to your workspace

import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import { schemaTypes } from './schemas'

// 1. Add the import
${dummies.import}

export default createConfig({
  theme, // <-- 2. add the theme here

  name: 'default',
  title: 'My Sanity Project',
  projectId: 'b5vzhxkv',
  dataset: 'production',
  plugins: [deskTool()],
  schema: { types: schemaTypes,},
})

`,
  ],
  [
    'studio-config-static-import',
    ['import'],
    `
    // Add two lines of code to your workspace

import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
// 1. Add the import
${dummies.import}

import { schemaTypes } from './schemas'


export default createConfig({
  theme, // <-- 2. add the theme here

  name: 'default',
  title: 'My Sanity Project',
  projectId: 'b5vzhxkv',
  dataset: 'production',
  plugins: [deskTool()],
  schema: { types: schemaTypes,},
})

`,
  ],
  [
    'studio-config-local-import',
    [],
    `
    // Add two lines of code to your workspace

import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
// 1. Add the import to the theme.js you downloaded
import {theme} from './theme'

import { schemaTypes } from './schemas'


export default createConfig({
  theme, // <-- 2. add the theme here

  name: 'default',
  title: 'My Sanity Project',
  projectId: 'b5vzhxkv',
  dataset: 'production',
  plugins: [deskTool()],
  schema: { types: schemaTypes,},
})

`,
  ],
  [
    'studio-config-local-import-ts',
    [],
    `
    // Add the theme import and its typings to your workspace

import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import { schemaTypes } from './schemas'

// 1. Add the import to the theme.js you downloaded
import {theme as _theme} from './theme'

// 2. Assign typings to the theme
const theme = _theme as import('sanity').StudioTheme

export default createConfig({
  theme, // <-- 3. add the theme here

  name: 'default',
  title: 'My Sanity Project',
  projectId: 'b5vzhxkv',
  dataset: 'production',
  plugins: [deskTool()],
  schema: { types: schemaTypes,},
})

`,
  ],
  [
    'studio-config-next-runtime-1',
    [],
    `
    // There's no theme import in this file since we're handling that in a useEffect in the index page

import {createConfig} from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './schemas'


export default createConfig({
  name: 'default',
  title: 'My Sanity Project',
  projectId: 'b5vzhxkv',
  dataset: 'production',
  plugins: [deskTool()],
  schema: { types: schemaTypes,},
})

`,
  ],
  [
    'studio-config-next-runtime-2',
    [],
    `
    // Allow reading the default theme variables while the custom theme is loading

import {createConfig, defaultTheme} from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './schemas'


export default createConfig({
  theme: defaultTheme,

  name: 'default',
  title: 'My Sanity Project',
  projectId: 'b5vzhxkv',
  dataset: 'production',
  plugins: [deskTool()],
  schema: { types: schemaTypes,},
})

`,
  ],
  [
    'sanity.cli.ts',
    [],
    `// Change target to allow top-level await in sanity.config.ts

    import { createCliConfig } from 'sanity/cli'
    import type { UserConfig } from "vite";
    
    export default createCliConfig({api: {projectId: 'b5vzhxkv',dataset: 'production'}, vite: (config: UserConfig): UserConfig => ({...config,build: {...config.build,target: "esnext"},})})
`,
  ],
  [
    'sanity.cli.js',
    [],
    `// Change target to allow top-level await in sanity.config.js

    import { createCliConfig } from 'sanity/cli'
    
    export default createCliConfig({api: {projectId: 'b5vzhxkv',dataset: 'production'},vite: (config) => ({...config, build: {...config.build,target: "esnext"},})})
`,
  ],
  [
    'studio-config-create-theme',
    ['import'],
    `// Import createTheme and hues to quickly modify your theme without changing the import URL

import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import { schemaTypes } from './schemas'

${dummies.import}

export default createConfig({
  theme: createTheme({...hues, primary: { ...hues.primary, mid: '#22fca8' } }),

  name: 'default',
  title: 'My Sanity Project',
  projectId: 'b5vzhxkv',
  dataset: 'production',
  plugins: [deskTool()],
  schema: { types: schemaTypes,},
})

`,
  ],
  [
    'import-create-theme-static',
    ['esmUrl'],
    `import { createTheme, hues } from ${dummies.esmUrl};
`,
  ],
  [
    'import-create-theme-dynamic',
    ['esmUrl'],
    `const { createTheme, hues } = await import(${dummies.esmUrl});
`,
  ],
  [
    'themer.d.ts',
    ['esmUrl'],
    `
    module ${dummies.esmUrl} {
      interface Hue extends Omit<import('@sanity/color').ColorHueConfig, 'title' | 'midPoint'> {
        midPoint: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
      }
      interface Hues {
        default: Hue
        transparent: Hue
        primary: Hue
        positive: Hue
        caution: Hue
        critical: Hue
      }
      const hues: Hues
      type Theme = import('sanity').StudioTheme
      const createTheme = (hues: Hues): Theme => theme
      const theme: Theme

  export { hues, createTheme, theme }
}

    `,
  ],
  [
    'tsconfig',
    [],
    `
  {
    "compilerOptions": {
      // target needs to be es2017 or newer to allow top-level await
      "target": "es2017",
  
      "lib": ["dom", "dom.iterable", "esnext"],
      "allowJs": true,
      "skipLibCheck": true,
      "strict": true,
      "forceConsistentCasingInFileNames": true,
      "noEmit": true,
      "esModuleInterop": true,
      "module": "esnext",
      "moduleResolution": "node",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "jsx": "preserve",
      "incremental": true
    },
    "include": ["**/*.ts", "**/*.tsx"],
    "exclude": ["node_modules"]
  }
  `,
    'json',
  ],
  // @TODO suggest adding children props (for example prehead, posthead, prebody, children, postbody) to stop the need to do a full document override
  [
    '_document.tsx',
    ['esmUrl'],
    `// This is to generate a <link rel="modulepreload" href=${dummies.esmUrl}> to the <head>
    // As Studio v3 is in developer preview there's not yet a simple way to just add a <link> tag to the <head>
// Thus we have to re-implement DefaultDocument to make it happen.
// Expect this to get much easier before v3 hits stable

import React from 'react'
import { type DefaultDocumentProps } from 'sanity'
import {GlobalErrorHandler} from 'sanity/_unstable'

const globalStyles = \`
  html {
    background-color: #f1f3f6;
  }
  html,
  body,
  #sanity {
    height: 100%;
  }
  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
  }
\`

interface FaviconProps {
  basePath: string
}

function Favicons({basePath}: FaviconProps) {
  const base = \`\${basePath.replace(/\\/+$/, '')}/static\`
  return (
    <>
      <link rel="icon" href={\`\${base}/favicon.ico\`} sizes="any" />
      <link rel="icon" href={\`\${base}/favicon.svg\`} type="image/svg+xml" />
      <link rel="apple-touch-icon" href={\`\${base}/apple-touch-icon.png\`} />
      <link rel="manifest" href={\`\${base}/manifest.webmanifest\`} />
    </>
  )
}


const EMPTY_ARRAY: never[] = []
export default function DefaultDocument(props: DefaultDocumentProps): React.ReactElement {
  const {entryPath, css = EMPTY_ARRAY, basePath = '/'} = props
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="robots" content="noindex" />
        <meta name="referrer" content="same-origin" />
        {/* This is the only line of code we're adding that is different from the default implementation of DefaultDocument */}
        <link rel="modulepreload" href={${dummies.esmUrl}} />

        <Favicons basePath={basePath} />

        <title>Sanity Studio</title>

        <GlobalErrorHandler />

        {css.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <style>{globalStyles}</style>
      </head>
      <body>
        <div id="sanity" />
        <script type="module" src={entryPath} />
      </body>
    </html>
  )
}

    `,
  ],
  [
    '_document.js',
    ['esmUrl'],
    `
    // This is to generate a <link rel="modulepreload" href=${dummies.esmUrl}> to the <head>
    // As Studio v3 is in developer preview there's not yet a simple way to just add a <link> tag to the <head>
// Thus we have to re-implement DefaultDocument to make it happen.
// Expect this to get much easier before v3 hits stable

import React from 'react'
import {GlobalErrorHandler} from 'sanity/_unstable'

const globalStyles = \`
  html {
    background-color: #f1f3f6;
  }
  html,
  body,
  #sanity {
    height: 100%;
  }
  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
  }
\`

function Favicons({basePath}) {
  const base = \`\${basePath.replace(/\\/+$/, '')}/static\`
  return (
    <>
      <link rel="icon" href={\`\${base}/favicon.ico\`} sizes="any" />
      <link rel="icon" href={\`\${base}/favicon.svg\`} type="image/svg+xml" />
      <link rel="apple-touch-icon" href={\`\${base}/apple-touch-icon.png\`} />
      <link rel="manifest" href={\`\${base}/manifest.webmanifest\`} />
    </>
  )
}


const EMPTY_ARRAY = []
export default function DefaultDocument(props) {
  const {entryPath, css = EMPTY_ARRAY, basePath = '/'} = props
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="robots" content="noindex" />
        <meta name="referrer" content="same-origin" />
        {/* This is the only line of code we're adding that is different from the default implementation of DefaultDocument */}
        <link rel="modulepreload" href={${dummies.esmUrl}} />

        <Favicons basePath={basePath} />

        <title>Sanity Studio</title>

        <GlobalErrorHandler />

        {css.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <style>{globalStyles}</style>
      </head>
      <body>
        <div id="sanity" />
        <script type="module" src={entryPath} />
      </body>
    </html>
  )
}

    `,
  ],
  [
    'next-config-build-time-js',
    ['esmUrl'],
    `
module.exports = {experimental: {urlImports: [${dummies.esmUrl}],},}
    `,
  ],
  [
    'next-config-build-time-ts',
    ['esmUrl'],
    `// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {experimental: {urlImports: [${dummies.esmUrl}],},}

module.exports = nextConfig
    `,
  ],
  [
    'pages/_document.tsx',
    [],
    `
    // This is necessary for SSR to work correctly and prevents broken CSS
    
    import Document, { type DocumentContext } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
      }
    } finally {
      sheet.seal()
    }
  }
}

    `,
  ],
  [
    'pages/_document.js',
    [],
    `
    // This is necessary for SSR to work correctly and prevents broken CSS
    
    import Document from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
      }
    } finally {
      sheet.seal()
    }
  }
}

    `,
  ],
  [
    'studio-config-create-theme-static-import',
    ['import'],
    `// Import createTheme and hues to quickly modify your theme without changing the import URL

import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

${dummies.import}

import { schemaTypes } from './schemas'


export default createConfig({
  theme: createTheme({...hues, primary: { ...hues.primary, mid: '#22fca8' } }),

  name: 'default',
  title: 'My Sanity Project',
  projectId: 'b5vzhxkv',
  dataset: 'production',
  plugins: [deskTool()],
  schema: { types: schemaTypes,},
})

`,
  ],
  [
    'pages-index',
    ['esmUrl'],
    `// Loading the custom theme on the page level instead of in sanity.config

    import Head from 'next/head'
    import {useEffect, useState} from 'react'
    import {Studio} from 'sanity'
    
    import _config from '../sanity.config'
    
    export default function IndexPage() {
      const [config, setConfig] = useState(_config)
    
      useEffect(
        // Start fetching the theme in parallel with the Studio auth loading
        () =>
        // The webpackIgnore tells webpack to not attempt bundling this dynamic import, 
        // and instead let it run natively in the browser at runtime
          void import(
            /* webpackIgnore: true */ ${dummies.esmUrl}
          ).then(({theme}) =>
            setConfig((config) => ({...config, theme}))
          ),
        []
      )
    
      return <Studio config={config} />
    }
`,
  ],
]

// Sanity check
const idsChecked = new Set()
for (const [id] of snippets) {
  if (idsChecked.has(id)) {
    throw new Error(`Duplicate id: ${id}`)
  }
  idsChecked.add(id)
}

const overloads = []
const getArgs = (argsLength) => {
  const input = args.map((_) => `${_}: string`)
  switch (argsLength) {
    case 1:
      return input[0]
    case 2:
      return [input[0], input[1]].join(', ')
    default:
      return ''
  }
}

const idsList = `export [${[...idsChecked]
  .map((id) => JSON5.stringify(id))
  .join(',')}]`

console.group('snippets.map')
const cases = snippets.map(
  ([id, placeholders, snippet, format = 'typescript']) => {
    console.group('prettier')
    let code = prettier
      .format(snippet, format === 'json' ? jsonOptions : options)
      .trim()
    console.log(code)
    console.groupEnd()
    // @ts-expect-error -- dunno what to do with the typing of placeholders, maybe try the `const snippets = as const` trick?
    for (const i in placeholders) {
      const key = placeholders[i]
      const dummy = dummies[key]
      const arg = `\${${args[i]}}`
      code = code
        .replaceAll('${', '${"${"}')
        .replaceAll('`', '${"`"}')
        .replaceAll(String.raw`/\/+$/`, `\${${new RegExp(/\/+$/)}}`)
        .replaceAll(dummy, arg)
    }
    console.group('template')
    const { length } = placeholders
    const argsString = getArgs(length)
    const callback = `(${getArgs(length)}) => \`${code}\``
    overloads.push(
      `export function snippet(id: ${JSON5.stringify(
        id
      )}): ${`(${argsString}) => string`}`
    )
    const template = `
  case ${JSON5.stringify(id)}:
    return ${callback}
  `
    console.log(template)
    console.groupEnd()
    return template
  }
)
console.groupCollapsed()

const codeSnippets = `
// Automatically generated by running \`npm run build:snippets\`

${overloads.join('\n')}
export function snippet(id) {
  switch (id) {
    ${cases.join('\n')}
    default:
      throw new TypeError('Unknown snippet id: ' + id);
  }
}

export const snippets = [${[...idsChecked]
  .map((id) => JSON5.stringify(id))
  .join(',')}] as const;
`

const dest = new URL('../utils/snippets.ts', import.meta.url)
await writeFileAtomic(dest.pathname, codeSnippets)
