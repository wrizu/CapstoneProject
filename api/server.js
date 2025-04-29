import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getXataClient } from './src/xata.js'; // Correct import

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root
dotenv.config({ path: path.resolve(__dirname, '../process.env') });

const app = express();
const PORT = process.env.PORT || 5432;

// Initialize the Xata client using getXataClient function
const xata = getXataClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DATABASE_URL,
  branch: 'main',
});

// Middleware to parse JSON
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../public')));

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// POST endpoint to fetch filtered rows from 'player_stats' table
app.post('/api/query', async (req, res) => {
  try {
    const { map, agent, player } = req.body;

    // Build filter object dynamically based on provided fields
    const filters = [];
    if (map) filters.push({ column: 'Map', operator: '=', value: map });
    if (agent) filters.push({ column: 'Agents', operator: '=', value: agent });
    if (player) filters.push({ column: 'Player', operator: '=', value: player });

    // Create a Xata-style filter object
    const where = {};
    for (const filter of filters) {
      where[filter.column] = filter.value;
    }

    const data = await xata.db.players_stats.filter(where).getAll();

    res.status(200).json(data);
  } catch (error) {
    console.error('Xata API query error:', error);
    res.status(500).json({ error: 'Server error while executing query' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
