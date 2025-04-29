import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Used for making API requests
import express from 'express';
import { XataApiClient } from '@xata.io/client';

// Load environment variables from .env file
dotenv.config({path: '/workspaces/CapstoneProject/process.env'});

const app = express();
const port = process.env.PORT || 3000;

// Initialize the Xata client
const xata = new XataApiClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DATABASE_URL,
  fetch: fetch,
});

// Middleware to parse JSON request bodies
app.use(express.json());

// POST endpoint to query the database
app.post('/api/query', async (req, res) => {
  console.log('POST /api/query called');
  try {
    const results = await xata.db.valorant.getMany(); // Change 'valorant' to your table name if needed
    res.status(200).json(results);
  } catch (error) {
    console.error('❌ Error fetching from Xata:', error);
    res.status(500).json({ error: 'Failed to fetch data from Xata' });
  }
});

// Simple GET endpoint to verify server is running
app.get('/', (req, res) => {
  res.send('✅ Server is running. Use POST /api/query to access the database.');
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server connected and running on port ${port}`);
});
