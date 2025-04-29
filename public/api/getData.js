import { XataApiClient } from '@xata.io/client'

const xata = new XataApiClient({
  apiKey: process.env.XATA_API_KEY
,
  databaseURL: process.env.DATABASE_URL,
})

export default async function handler(req, res) {
  try {
    // Example: Query data from the 'valorant' table
    const results = await xata.db.valorant.read()
    res.status(200).json(results)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch data' })
  }
}
