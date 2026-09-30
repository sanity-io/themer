// Captures goldens for new contract cases from production. Existing goldens
// are never rewritten: they hold what production Studios import today, so
// changing one changes the contract, and has to be done deliberately.
import {access, writeFile} from 'node:fs/promises'

import {cases, decode, goldenUrl, normalize, PRODUCTION_URL, request} from './api-hues.mjs'

await Promise.all(
  cases.map(async ({name, query}) => {
    const url = goldenUrl(name)
    const exists = await access(url).then(
      () => true,
      () => false,
    )
    if (exists) return

    const response = await request(PRODUCTION_URL, query)
    if (response.status !== 200) {
      throw new Error(`${response.url} responded ${response.status}`)
    }
    await writeFile(url, normalize(decode(response.bytes), PRODUCTION_URL))
    process.stdout.write(`Captured goldens/${name}.golden from ${response.url}\n`)
  }),
)
