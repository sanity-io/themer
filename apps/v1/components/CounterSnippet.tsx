import { memo, useEffect } from 'react'

// https://counter.dev/dashboard.html

export default memo(function CounterSnippet() {
  useEffect(() => {
    if (!sessionStorage.getItem('_swa')) {
      const params = new URLSearchParams({
        referrer: document.referrer,
        screen: screen.width + 'x' + screen.height,
        user: process.env.NEXT_PUBLIC_COUNTER_DEV,
        utcoffset: '1',
      })
      if ('sendBeacon' in navigator) {
        navigator.sendBeacon('https://counter.dev/track', params)
      } else {
        fetch('https://counter.dev/track?' + params)
      }

      sessionStorage.setItem('_swa', '1')
    }
  }, [])

  return null
})
