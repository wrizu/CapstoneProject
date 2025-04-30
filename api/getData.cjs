const path = require('path');
const dotenv = require('dotenv');
const { getXataClient } = require('../src/xata.js');

dotenv.config({ path: path.resolve(__dirname, 'process.env') });

const xata = getXataClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DATABASE_URL,
  branch: 'main'
});

module.exports = async function (req, res) {
  try {
    const results = await xata.db.players_stats.getAll();
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
