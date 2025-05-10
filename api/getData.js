const { getXataClient } = require('../src/xata'); // Correct import for the client factory
const xata = getXataClient(); // Instantiate the client

module.exports = async function handler(req, res) {
  try {
    const results = await xata.db.players_stats.getAll(); // Fetch all data
    res.status(200).json(results);
  } catch (error) {
    console.error('❌ Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
