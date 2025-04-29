import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getXataClient } from './src/xata.js'; // Import Xata client generator

// Initialize __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../process.env') });

const app = express();
const PORT = process.env.PORT || 5432;

// Middleware to parse JSON
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../public')));

// Initialize Xata client from env vars
const xata = getXataClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DATABASE_URL,
  branch: 'main',
});

// Serve index.html as fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// GET query endpoint
app.get('/api/query', async (req, res) => {
  try {
    const { Agents, Rating, Teams, Player, KD } = req.query;

    const filter = {
      ...(Agents && { Agents }),
      ...(Rating && { Rating }),
      ...(Teams && { Teams }),
      ...(Player && { Player }),
      ...(KD && { KD }),
    };

    const results = await xata.db.players_stats.filter(filter).getAll();
    res.status(200).json(results);
  } catch (error) {
    console.error('GET query error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// POST query endpoint
app.post('/api/query', async (req, res) => {
  try {
    const { Agents, Rating, Teams, Player, KD } = req.body;

    const filter = {
      ...(Agents && { Agents }),
      ...(Rating && { Rating }),
      ...(Teams && { Teams }),
      ...(Player && { Player }),
      ...(KD && { KD }),
    };

    const results = await xata.db.players_stats.filter(filter).getAll();
    res.status(200).json(results);
  } catch (error) {
    console.error('POST query error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
