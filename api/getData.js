import { getXataClient } from './src/xata.js';// adjust path if needed
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('./api/.env') });

const xata = getXataClient({ apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DATABASE_URL,
  branch: 'main'});

export default async function handler(req, res) {
  try {
    const results = await xata.db.players_stats.getAll(); // update to match your table name
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
