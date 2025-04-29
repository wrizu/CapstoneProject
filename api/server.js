import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { XataApiClient } from '@xata.io/client';
import { getXataClient } from './xata.js';

dotenv.config({ path: './process.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON body
app.use(express.json());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Xata setup
const xata = new getXataClient({
    apiKey: process.env.XATA_API_KEY,
    databaseURL: process.env.XATA_DATABASE_URL,
    branch: 'main'
  });

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// GET request with query parameters
app.get('/api/query', async (req, res) => {
  try {
    const { Map, Agent, Rank } = req.query;

    const filter = {
      ...(Map && { Map }),
      ...(Agent && { Agent }),
      ...(Rank && { Rank })
    };

    const results = await xata.db.valorant.filter(filter).getAll();
    res.status(200).json(results);
  } catch (error) {
    console.error('GET query error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// POST request with body parameters
app.post('/api/query', async (req, res) => {
  try {
    const { Map, Agent, Rank } = req.body;

    const filter = {
      ...(Map && { Map }),
      ...(Agent && { Agent }),
      ...(Rank && { Rank })
    };

    const results = await xata.db.valorant.filter(filter).getAll();
    res.status(200).json(results);
  } catch (error) {
    console.error('POST query error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
