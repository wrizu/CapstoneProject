require('dotenv').config({ path: './process.env' });

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { getXataClient, XataClient } = require('./src/xata.js');

const app = express();
const PORT = process.env.PORT || 5432;

// Initialize Xata client with env variables
const xata = new XataClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DATABASE_URL,
  branch: 'main'
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Avoid favicon errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Health check
app.get('/api/query', (req, res) => {
  res.json({ message: "GET request received. Use POST with a SQL query." });
});

// Query handling
app.post('/api/query', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'No query provided' });
  }

  try {
    const normalized = query.trim().toLowerCase();

    if (
      normalized === "select * from players_stats" ||
      normalized === "select * from players_stats;"
    ) {
      const results = await xata.db.players_stats.getAll();
      return res.json(results);
    } else if (
      normalized === "select distinct player from players_stats" ||
      normalized === "select distinct player from players_stats;"
    ) {
      const allPlayers = await xata.db.players_stats.getAll();
      const uniquePlayers = [...new Set(allPlayers.map(row => row.Player))];
      return res.json(uniquePlayers);
    } else if (
      normalized === "select player from players_stats where team = 'edward gaming'" ||
      normalized === "select player from players_stats where team = 'edward gaming';"
    ) {
      const edgPlayers = await xata.db.players_stats
        .filter({ Team: 'EDward Gaming' })
        .select(['Player'])
        .getAll();
      return res.json(edgPlayers.map(row => row.Player));
    } else {
      return res.status(400).json({
        error: 'Unsupported query. Allowed: basic SELECTs on players_stats.'
      });
    }
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ error: 'Failed to execute query', details: error.message });
  }
});

// Export for Vercel
module.exports = app;

// Start server locally
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
