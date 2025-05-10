const { xataClient } = require('../src/xata'); // Corrected path to xata.js

module.exports = async (req, res) => {
  try {
    const players = await xataClient.db.players_stats
      .select(['*']) // Fetch all fields
      .orderBy('KD', 'desc')
      .limit(10); // Top 10

    res.status(200).json(players);
  } catch (error) {
    console.error('❌ Error fetching top players:', error.message);
    res.status(500).json({ error: 'Failed to fetch top players' });
  }
};
