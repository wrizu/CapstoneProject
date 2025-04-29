require('dotenv').config({ path: './process.env' }); 

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { getXataClient, XataClient } = require('./src/xata.js');

const app = express();
const PORT = process.env.PORT || 5432;

// Explicitly create Xata client with env vars (optional, only if needed)
const xata = new XataClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DATABASE_URL,
  branch: 'main'
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/api/query', (req, res) => {
  res.json({ message: "GET request received. Use POST with a SQL query." });
});

app.post('/api/query', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'No query provided' });
  }

  try {
    const normalized = query.trim().toLowerCase();
    if (normalized === "select * from players_stats;" || normalized === "select * from players_stats" || normalized === "select distinct player from players_stats") {
      const results = await xata.db.players_stats.getAll();

      if (!results || results.length === 0) {
        return res.json({ message: 'No results found' });
      }

      return res.json(results);
    } else {
      return res.status(400).json({ error: 'Only "SELECT * FROM players_stats" queries are supported.' });
    }
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ error: 'Failed to execute query', details: error.message });
  }
});

// Export for Vercel
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
