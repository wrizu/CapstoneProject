require('dotenv').config();
const express = require('express');
const path = require('path');

const { getXataClient } = require('./src/xata.js'); // Adjust path if needed

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Xata client
const xata = getXataClient();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// API route: /api/query
app.post('/api/query', async (req, res) => {
  const { tournament, agent, player, teams, kd } = req.body;

  try {
    const filters = [];

    if (tournament) filters.push({ Tournament: tournament });
    if (agent) filters.push({ Agents: agent });
    if (player) filters.push({ Player: player });
    if (teams) filters.push({ Teams: teams });

    const query = xata.db.players_stats.filter({ $all: filters });

    if (kd !== null && kd !== undefined && kd !== '') {
      const kdString = kd.toString().trim();
      const regex = /^(>=|<=|<>|>|<|=)/;
      const operatorMatch = kdString.match(regex);
      const operator = operatorMatch ? operatorMatch[0] : '=';

      const numberPart = kdString.replace(regex, '').trim();
      const number = parseFloat(numberPart);

      if (!isNaN(number)) {
        query.filter({
          KD: {
            [`$${operator}`.replace('=', 'eq').replace('<>', 'ne')]: number,
          },
        });
      } else {
        return res.status(400).json({ error: 'Invalid KD value' });
      }
    }

    const results = await query.sort('KD', 'desc').getAll();
    res.json(results);
  } catch (error) {
    console.error('❌ Xata query error:', error.message);
    res.status(500).json({ error: 'Xata query failed', details: error.message });
  }
});

// Catch-all API route: Handle unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
