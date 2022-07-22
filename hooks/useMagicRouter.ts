import {
  type History,
  type Listener,
  type MemoryHistory,
  createHashHistory,
  createMemoryHistory,
} from 'history'
import { useMemo } from 'react'

export function useMagicRouter(type: 'memory' | 'hash' = 'memory') {
  const history = useMemo<History>(() => {
    const history =
      type === 'hash'
        ? createHashHistory()
        : createMemoryHistory({
            initialEntries: ['/'],
          })
    return {
      get action() {
        return history.action
      },
      get index() {
        return type === 'hash' ? 0 : (history as MemoryHistory).index
      },
      get location() {
        return history.location
      },
      get createHref() {
        return history.createHref
      },
      get push() {
        // @TODO make this behavior configurable
        // don't add to the history array on studio nav as color vars aren't in sync beyond initial page load
        return type === 'hash' ? history.replace : history.push
      },
      get replace() {
        return history.replace
      },
      get go() {
        return history.go
      },
      get back() {
        return history.back
      },
      get forward() {
        return history.forward
      },
      get block() {
        return history.block
      },
      // Overriding listen to workaround a problem where native history provides history.listen(location => void), but the npm package is history.listen(({action, location}) => void)
      listen(listener: Listener) {
        return history.listen(({ action, location }) => {
          // console.debug('history.listen', action, location)
          // @ts-expect-error -- working around a bug? in studio
          listener(location)
        })
      },
    }
  }, [type])

  return history
}
