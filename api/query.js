

import dotenv from 'dotenv'; 
dotenv.config(); // Load environment variables from .env file
import { XataApiClient } from '@xata.io/client'; 

import express from 'express';

const app = express();

// Initialize the Xata client
const xata = new XataApiClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DATABASE_URL,
});

// Log environment variables to ensure they are being loaded
console.log('XATA_API_KEY:', process.env.XATA_API_KEY);  // Should log your API key

// Middleware to parse JSON request bodies
app.use(express.json());

// Example route to interact with Xata API for VALORANT database
app.post('xau_Lt9h0yiw4vlawsDh6G2oTAEDPERQdH0I1', async (req, res) => {
  const { query } = req.body;
  const apiKey = process.env.XATA_API_KEY; // Get API Key from environment variables

  if (!apiKey) {
    return res.status(400).json({ error: 'API Key is missing from environment variables' });
  }

  try {
    // Query data from the 'valorant' table
    const results = await xata.db.valorant.getMany();  // Fetch all records from the 'valorant' table

    // Send back the data as response
    res.status(200).json(results);
  } catch (error) {
    console.error('Error making request to Xata API:', error);
    res.status(500).json({ error: 'Failed to fetch data from Xata API' });
  }
});

// Start the server
const port = process.env.PORT || 5432;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
