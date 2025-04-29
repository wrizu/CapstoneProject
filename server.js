import express from 'express';
import bodyParser from 'body-parser';
import { XataApiClient } from '@xata.io/client';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ path: './process.env' });  // Ensure you load your environment variables

const app = express();
const PORT = process.env.PORT || 5432;  // Make sure your port is correctly set

// Initialize the Xata client
const xata = new XataApiClient({
    apiKey: process.env.XATA_API_KEY,  // Make sure this is set in your environment
    databaseURL: process.env.XATA_DATABASE_URL,  // This should be set in your environment
    fetch: fetch, // Pass the fetch method here
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Handle POST request to query the database
app.post('/api/query', async (req, res) => {
    const { query } = req.body;  // Get the query from the request body

    if (!query) {
        return res.status(400).json({ error: 'No query provided' });
    }

    try {
        // Example query logic based on Xata's API structure
        if (query.toLowerCase().includes("select")) {
            // Assuming the table is 'players_stats'
            const results = await xata.db.players_stats.select("*").getMany();
            
            // Check if there are results
            if (!results || results.length === 0) {
                return res.json({ message: 'No results found' });
            }

            // Send back the results as a response
            res.json(results);
        } else {
            res.status(400).json({ error: 'Invalid query format. Only SELECT queries are allowed.' });
        }
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ error: 'Failed to execute query', details: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server connected and running on port ${PORT}`);
});
