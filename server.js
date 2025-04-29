import express from 'express';
import bodyParser from 'body-parser';
import { XataApiClient } from '@xata.io/client';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: './process.env' });

// To get the current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5432;  // Ensure your port is correctly set

// Initialize the Xata client
const xata = new XataApiClient({
    apiKey: process.env.XATA_API_KEY,  // Make sure this is set in your environment
    databaseURL: process.env.XATA_DATABASE_URL,  // This should be set in your environment
    fetch: fetch,
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle GET request for favicon.ico to avoid 404 errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Handle GET request for testing
app.get('/api/query', (req, res) => {
    res.json({ message: "GET request received. You can send a POST request to query the database." });
});

// Handle POST request to query the database
app.post('/api/query', async (req, res) => {
    const { query } = req.body;  // Get the query from the request body

    if (!query) {
        return res.status(400).json({ error: 'No query provided' });
    }

    try {
        // Execute the query using the Xata client
        const results = await xata.db.query(query).exec();

        // Check if there are results
        if (!results || results.length === 0) {
            return res.json({ message: 'No results found' });
        }

        // Send back the results as a response
        res.json(results);
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ error: 'Failed to execute query', details: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server connected and running on port ${PORT}`);
});
