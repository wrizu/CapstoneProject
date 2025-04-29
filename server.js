const express = require('express');
const bodyParser = require('body-parser');
const { XataApiClient } = require('@xata.io/client');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config({ path: './process.env' });

const app = express();
const PORT = process.env.PORT || 5432;

// Initialize the Xata client
const xata = new XataApiClient({
    apiKey: process.env.XATA_API_KEY,
    databaseURL: process.env.XATA_DATABASE_URL,
    fetch: fetch,
});

app.use(bodyParser.json());  // Middleware to parse JSON bodies

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
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'No query provided' });
    }

    try {
        const results = await xata.db.query(query).exec();

        if (!results || results.length === 0) {
            return res.json({ message: 'No results found' });
        }

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
