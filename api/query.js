import dotenv from 'dotenv'; 
dotenv.config(); // Load environment variables from .env file
import fetch from 'node-fetch';  // Use node-fetch to make requests
import express from 'express';

const app = express();

// Log environment variables to ensure they are being loaded
console.log('XATA_API_KEY:', process.env.XATA_API_KEY);  // Should log your API key

// Middleware to parse JSON request bodies
app.use(express.json());

// Example route to interact with Xata API for VALORANT database
app.post('/api/query', async (req, res) => {
  const { query } = req.body;
  const apiKey = process.env.XATA_API_KEY; // Get API Key from environment variables

  if (!apiKey) {
    return res.status(400).json({ error: 'API Key is missing from environment variables' });
  }

  try {
    // Define the Xata API endpoint for your database (use your specific database URL here)
    const xataDatabaseUrl = 'https://xata.io/workspaces/Jack-Burkhalter-s-workspace-v15me3/dbs/VALORANT/branches/main';

    // Make the authenticated request to Xata API for your database
    const response = await fetch(xataDatabaseUrl, {
      method: 'GET', // Assuming you want to GET data
      headers: {
        Authorization: `Bearer ${apiKey}`,  // Pass the API Key in the Authorization header
        'Content-Type': 'application/json'
      }
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Failed to fetch data from Xata API');
    }

    // Parse the response
    const data = await response.json();

    // Send back the data as response
    res.json(data);
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
