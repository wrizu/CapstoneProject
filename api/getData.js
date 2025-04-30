import { getXataClient } from '../src/xata.js';

const xata = getXataClient();

export default async function handler(req, res) {
  try {
    const results = await xata.db.players_stats.getAll(); // Adjust table name if needed
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
