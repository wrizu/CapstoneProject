import { Client } from '@xata.io/client'

const xata = new Client({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DB_URL,
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
