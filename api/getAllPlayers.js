const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT "Player" FROM players_stats ORDER BY "Player" ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('❌ getAllPlayers error:', error.message);
    res.status(500).json({ error: 'Failed to fetch players', details: error.message });
  }
};
