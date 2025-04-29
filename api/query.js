import 'dotenv/config';  // Load environment variables from .env file
import { XataApiClient } from '.xata'; 
import { getXataClient } from './xata'; // Correctly import XataClient
import express from 'express';

const app = express();

// Log environment variables to ensure they are being loaded
console.log('XATA_API_KEY:', process.env.XATA_API_KEY);  // Should log your API key
console.log('XATA_DATABASE_URL:', process.env.XATA_DATABASE_URL);  // Should log your database URL

// Initialize Xata client
const xata = new XataApiClient({
  apiKey: process.env.XATA_API_KEY,  // Make sure XATA_API_KEY is in your .env file
  databaseURL: process.env.XATA_DATABASE_URL  // Make sure DATABASE_URL is in your .env file
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

        let result;
        if (query.includes('players_stats')) {
            result = await xata.db.players_stats.query().limit(10).all();
        } else if (query.includes('maps_scores')) {
            result = await xata.db.maps_scores.query().limit(10).all();
        } else {
            return res.status(400).json({ error: 'Invalid table in query' });
        }

        // Serialize the result if necessary
        const serializedResult = result.toSerializable ? result.toSerializable() : result;
        res.json(serializedResult);  // Send the serialized result

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
