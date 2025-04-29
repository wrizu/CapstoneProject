import { XataApiClient } from '@xata.io/client';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: './process.env' });  // Load environment variables from './process.env'
import { getXataClient } from '/workspaces/CapstoneProject/src'

// Initialize the Xata client with configuration from the .env file
const xata = new XataApiClient({
    apiKey: process.env.XATA_API_KEY,  // Ensure the XATA_API_KEY is in your environment variables
    databaseURL: process.env.XATA_DATABASE_URL,  // Ensure the XATA_DATABASE_URL is in your environment variables
    fetch: fetch,  // Use fetch for making HTTP requests
});

export default async function handler(req, res) {
    // Handle POST request to query the database
    if (req.method === 'POST') {
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

    // Handle GET request for testing or to fetch all records from the correct table
    } else if (req.method === 'GET') {
        try {
            // Replace 'players_stats' with the correct table name from Xata
            const records = await xata.db.players_stats.select('*').exec();

            if (!records || records.length === 0) {
                return res.json({ message: 'No records found' });
            }

            // Send back the records as a response
            res.json(records);
        } catch (error) {
            console.error("Error fetching records:", error);
            res.status(500).json({ error: 'Failed to fetch records', details: error.message });
        }
    } else {
        // Handle unsupported methods (e.g., PUT, DELETE)
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
