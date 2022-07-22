import createClient from '@sanity/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ServerTiming } from 'utils/ServerTiming'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const serverTiming = new ServerTiming()
  serverTiming.start('handler')
  const { projectId, dataset, id } = req.query

  try {
    const client = createClient({
      projectId: Array.isArray(projectId) ? projectId[0] : projectId,
      dataset: Array.isArray(dataset) ? dataset[0] : dataset,
      apiVersion: '2022-07-10',
      useCdn: true,
    })
    serverTiming.start('fetch', 'query sanity.imageAsset.metadata.palette')
    const palette = await client.fetch(
      /* groq */ `*[ _type == "sanity.imageAsset" && _id == $id ][0].metadata.palette`,
      { id: Array.isArray(id) ? id[0] : id }
    )
    serverTiming.end('fetch')

    res.setHeader('Server-Timing', `${serverTiming}`)
    return res.status(200).json(palette)
  } catch (err) {
    res.setHeader('Server-Timing', `${serverTiming}`)
    return res.status(500).json({ message: err.message })
  }
}
