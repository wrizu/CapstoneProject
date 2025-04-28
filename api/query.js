require('dotenv').config();
const express = require('express');
const { Client } = require('@xata.io/client');
const app = express();

// Initialize the Xata client with the VALORANT database URL
const xata = new Client({
    apiKey: xau_Lt9h0yiw4vlawsDh6G2oTAEDPERQdH0I1,  // Ensure the API key is set in your environment variables
    databaseURL: 'https://Jack-Burkhalter-s-workspace-v15me3.us-east-1.xata.sh/db/VALORANT' // Use the full database URL from the .env file
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
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

