import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../process.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Set up PostgreSQL connection pool using Xata credentials
const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }  // Required by Xata
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// POST /api/query for filtering player stats
app.post('/api/query', async (req, res) => {
  const { tournament, agent, player, teams, kd } = req.body;

  try {
    let baseQuery = `SELECT * FROM players_stats WHERE 1=1`;
    const values = [];
    let i = 1;

    if (tournament) {
      baseQuery += ` AND "Tournament" = $${i++}`;
      values.push(tournament);
    }
    if (agent) {
      baseQuery += ` AND "Agents" = $${i++}`;
      values.push(agent);
    }
    if (player) {
      baseQuery += ` AND "Player" = $${i++}`;
      values.push(player);
    }
    if (teams) {
      baseQuery += ` AND "Teams" = $${i++}`;
      values.push(teams);
    }
    if (kd) {
      const operator = kd.match(/^[><=]=?|/)[0];
      const number = parseFloat(kd.replace(/^[><=]=?\s*/, ''));
      if (operator && !isNaN(number)) {
        baseQuery += ` AND "KD" ${operator} $${i++}`;
        values.push(number);
      }
    }

    const result = await pool.query(baseQuery, values);
    res.json(result.rows);
  } catch (error) {
    console.error('PostgreSQL query error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
