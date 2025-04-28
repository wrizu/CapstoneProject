import 'dotenv/config';  // Load environment variables from .env file
import XataClient from '@xata.io/client';
import express from 'express';

const app = express();

// Initialize Xata client
const xata = new XataClient({
  apiKey: process.env.XATA_API_KEY, // Make sure XATA_API_KEY is in your .env file
  databaseURL: process.env.DATABASE_URL // Make sure DATABASE_URL is in your .env file
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to query the `players_stats` table and return the first 10 rows
app.post('/api/query', async (req, res) => {
    const { query } = req.body;

    // Log the incoming query for debugging purposes
    console.log('Received query:', query);

    try {
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        // Handle different queries for players_stats and maps_scores
        if (query.includes('players_stats')) {
            const result = await xata.db.players_stats.query().limit(10).all();  // Adjust based on your setup
            res.json(result);
        } else if (query.includes('maps_scores')) {
            const result = await xata.db.maps_scores.query().limit(10).all();
            res.json(result);
        } else {
            res.status(400).json({ error: 'Invalid table in query' });
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Start the server
const port = process.env.PORT || 5432;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
