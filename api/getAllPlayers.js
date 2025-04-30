const { getXataClient } = require('../src/xata.js'); // Adjust path as needed

const xata = getXataClient();

module.exports = async (req, res) => {
  try {
    const results = await xata.sql`SELECT DISTINCT "Player" FROM players_stats ORDER BY "Player" ASC`;
    res.status(200).json(results.rows);
  } catch (error) {
    console.error('❌ getAllPlayers error:', error.message);
    res.status(500).json({ error: 'Failed to fetch players', details: error.message });
  }
};

