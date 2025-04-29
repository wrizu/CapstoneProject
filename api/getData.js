import { XataApiClient } from '@xata.io/client';
import dotenv from 'dotenv';

dotenv.config({ path: './process.env' });

const xata = new XataApiClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DATABASE_URL,
  branch: 'main'
});

export default async function handler(req, res) {
  try {
    const results = await xata.db.valorant.read();
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}