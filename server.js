require('dotenv').config({ path: './process.env' });

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { getXataClient, XataClient } = require('./src/xata.js');

const app = express();
const PORT = process.env.PORT || 5432;

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

    if (!normalized.startsWith('select')) {
      return res.status(400).json({ error: 'Only SELECT queries are supported.' });
    }

    const regex = /^select\s+(distinct\s+)?([\w\*,\s]+)\s+from\s+players_stats(?:\s+where\s+(.*))?;?$/i;
    const match = query.trim().match(regex);

    if (!match) {
      return res.status(400).json({ error: 'Unsupported or invalid query syntax.' });
    }

    const isDistinct = !!match[1];
    const columns = match[2].split(',').map(c => c.trim());
    const whereClause = match[3];

    let filterObj = {};
    if (whereClause) {
      const whereMatch = whereClause.match(/^(\w+)\s*=\s*'([^']+)'$/);
      if (!whereMatch) {
        return res.status(400).json({ error: 'Only simple equality WHERE clauses are supported (e.g., Teams = \'EDward Gaming\').' });
      }
      const [_, field, value] = whereMatch;
      
      // Check if the field exists in the schema
      const validFields = ['Player', 'Teams']; // Added Teams to valid fields
      if (!validFields.includes(field)) {
        return res.status(400).json({ error: `Invalid field name in WHERE clause: ${field}` });
      }

      filterObj[field] = value;
    }

    const queryBuilder = xata.db.players_stats;
    const data = whereClause
      ? await queryBuilder.filter(filterObj).select(columns).getAll()
      : await queryBuilder.select(columns).getAll();

    if (isDistinct && columns.length === 1) {
      const unique = [...new Set(data.map(row => row[columns[0]]))];
      return res.json(unique);
    }

    return res.json(data);
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
