import 'style.css'

import CounterSnippet from 'components/CounterSnippet'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      {process.env.NEXT_PUBLIC_COUNTER_DEV && <CounterSnippet />}
    </>
  )
}
