// Worker that imports a served `/api/hues` module the way a Studio does, with
// a global scope and module cache of its own, and reports what it saw.
import {setTimeout as delay} from 'node:timers/promises'
import {parentPort, workerData} from 'node:worker_threads'

const {bytes, environment} = workerData
const logged = []
const reported = []
const listeners = []

console.error = (...args) => logged.push(args)

switch (environment) {
  case 'server':
    break
  case 'browser, loading':
    globalThis.document = {readyState: 'loading'}
    globalThis.window = {
      addEventListener: (type, listener, options) => listeners.push({type, listener, options}),
      reportError: (error) => reported.push(error),
    }
    break
  case 'browser, loaded':
    globalThis.document = {readyState: 'complete'}
    globalThis.window = {}
    break
  default:
    throw new Error(`Unknown environment: ${environment}`)
}

const describeError = (error) => ({
  constructor: error?.constructor?.name,
  message: error?.message,
})

const result = {}
let namespace
try {
  namespace = await import(`data:text/javascript;base64,${Buffer.from(bytes).toString('base64')}`)
} catch (error) {
  result.importError = describeError(error)
}

if (namespace) {
  const {createTheme, hues, theme} = namespace
  result.exports = Object.fromEntries(
    Object.keys(namespace).map((name) => [name, typeof namespace[name]]),
  )
  result.hues = hues
  result.theme = theme
  try {
    result.recreated = createTheme(hues)
    // The snippet Themer showed for tweaking a theme in code
    result.tweaked = createTheme({
      ...hues,
      primary: {...hues.primary, mid: '#22fca8'},
    })
  } catch (error) {
    result.createThemeError = describeError(error)
  }
}

// The browser fires `load` once the document has loaded, and the deprecation
// notice reports itself in a task of its own
for (const {type, listener} of listeners) {
  if (type === 'load') listener()
}
await delay(0)

result.logged = logged
result.reported = reported.map(describeError)
result.listeners = listeners.map(({type, options}) => ({type, options}))
// oxlint-disable-next-line unicorn/require-post-message-target-origin -- a worker's parentPort takes a transfer list, not a target origin
parentPort.postMessage(result)
