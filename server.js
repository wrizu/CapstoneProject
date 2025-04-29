require('dotenv').config({ path: './process.env' });
const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const fetch = require('node-fetch');

const { getXataClient } = require('./src/xata.js'); // Use the .js version now

const app = express();
const PORT = process.env.PORT || 5432;

// Initialize the Xata client
const xata = getXataClient();

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
    const { query } = req.body;  // Get the query from the request body

    if (!query) {
        return res.status(400).json({ error: 'No query provided' });
    }

    try {
        // Example query logic based on Xata's API structure
        if (query.toLowerCase().includes("select")) {
            // Make sure to replace 'players_stats' with the actual table name if needed
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

// Vercel requires the `app` to be exported as the request handler
module.exports = app;  // Exporting app to ensure Vercel can use it

// Optional: Listen on a port for local testing
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
