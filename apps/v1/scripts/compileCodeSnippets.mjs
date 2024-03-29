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
const projectId = `'b5vzhxkv'`
const dataset = `'production'`

const snippets = [
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
// 1. Add the import
${dummies.import}

import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

export default createConfig({
  theme, // <-- 2. add the theme here

  projectId: ${projectId},
  dataset:  ${dataset},
  plugins: [deskTool()],
  schema: { types: [],},
})

`,
  ],
  [
    'studio-config-local-import',
    [],
    `
import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

// 1. Add the import to the theme.js you downloaded
import {theme} from './theme'

export default createConfig({
  theme, // <-- 2. add the theme here

  projectId: ${projectId},
  dataset: ${dataset},
  plugins: [deskTool()],
  schema: { types: [],},
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


// 1. Add the import to the theme.js you downloaded
import {theme as _theme} from './theme'

// 2. Assign typings to the theme
const theme = _theme as import('sanity').StudioTheme

export default createConfig({
  theme, // <-- 3. add the theme here

  projectId: ${projectId},
  dataset: ${dataset},
  plugins: [deskTool()],
  schema: { types: [],},
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


export default createConfig({
  projectId: ${projectId},
  dataset: ${dataset},
  plugins: [deskTool()],
  schema: { types: [],},
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


export default createConfig({
  theme: defaultTheme,

  projectId: ${projectId},
  dataset: ${dataset},
  plugins: [deskTool()],
  schema: { types: [],},
})

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

  title: 'My Sanity Project',
  projectId: ${projectId},
  dataset: ${dataset},
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
declare module ${dummies.esmUrl} {
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
      export const hues: Hues
      type Theme = import('sanity').StudioTheme
      export function createTheme(_hues: Hues): Theme
      export const theme: Theme
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
      "target": "esnext",
  
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
    'studio-config-create-theme-static-import',
    ['import'],
    `// Import createTheme and hues to quickly modify your theme without changing the import URL

import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

${dummies.import}

import { schemaTypes } from './schemas'


export default createConfig({
  theme: createTheme({...hues, primary: { ...hues.primary, mid: '#22fca8' } }),

  title: 'My Sanity Project',
  projectId: ${projectId},
  dataset: ${dataset},
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
    import {NextStudio} from 'next-sanity'
    
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
    
      return <NextStudio config={config} />
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
    console.group('dotenv')
    code = code
      .replaceAll(projectId, '${projectId}')
      .replaceAll(dataset, '${dataset}')
    console.groupEnd()

    const { length } = placeholders
    const argsString = getArgs(length)
    const callback = `(${getArgs(length)}) => \`${code}\``
    overloads.push(
      `export function snippet(id: ${JSON5.stringify(
        id,
      )}): ${`(${argsString}) => string`}`,
    )
    const template = `
  case ${JSON5.stringify(id)}:
    return ${callback}
  `
    console.log(template)
    console.groupEnd()
    return template
  },
)
console.groupCollapsed()

const codeSnippets = `
// Automatically generated by running \`npm run build:snippets\`
import JSON5 from 'json5'
const projectId = JSON5.stringify(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
const dataset = JSON5.stringify(process.env.NEXT_PUBLIC_SANITY_DATASET)

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
