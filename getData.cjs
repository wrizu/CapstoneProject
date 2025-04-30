const path = require('path');
const dotenv = require('dotenv');
const { getXataClient } = require('./api/src/xata.js'); // Adjust path as needed

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, 'process.env') });

// Initialize Xata client
const xata = getXataClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DATABASE_URL,
  branch: 'main'
});

// Express-compatible route handler
module.exports = async function (req, res) {
  try {
    const results = await xata.db.players_stats.getAll(); // Adjust to match your table name
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
