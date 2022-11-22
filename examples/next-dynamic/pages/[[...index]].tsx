import Head from 'next/head'
import { NextStudio } from 'next-sanity/studio'
import { NextStudioHead } from 'next-sanity/studio/head'
import { useEffect, useState } from 'react'

import _config from '../sanity.config'

export default function IndexPage() {
  const [config, setConfig] = useState(_config)

  useEffect(
    () =>
      void import(
        /* webpackIgnore: true */ 'https://themer.sanity.build/api/hues?preset=dew'
      ).then(({ theme }) => setConfig((config) => ({ ...config, theme }))),
    []
  )

  return (
    <>
      <Head>
        <NextStudioHead />
        <link
          // Speed up the theme loading significantly
          rel="modulepreload"
          href={'https://themer.sanity.build/api/hues?preset=dew'}
        />
      </Head>
      <NextStudio config={config} />
    </>
  )
}
