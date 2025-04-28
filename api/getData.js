import { Client } from '@xata.io/client'

const xata = new Client({
  apiKey: xau_Lt9h0yiw4vlawsDh6G2oTAEDPERQdH0I1
,
  databaseURL: https://Jack-Burkhalter-s-workspace-v15me3.us-east-1.xata.sh/db/VALORANT,
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
