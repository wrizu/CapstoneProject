import dotenv from 'dotenv';
import fetch from 'node-fetch';  // Use node-fetch to make requests
import { XataApiClient } from '@xata.io/client';

// Load environment variables from the .env file
dotenv.config({ path: './process.env' });

// Initialize the Xata client
const xata = new XataApiClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DATABASE_URL,
  fetch: fetch,
});

// This will be the API route triggered by requests to /api/query
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Get the SQL query from the request body
      const { query } = req.body;

      // Log the query to make sure it's being sent correctly
      console.log('Received query:', query);

      // Query data from the 'valorant' table (you can change the query as needed)
      const results = await xata.db.valorant.getMany();

      // Send the results back as a response
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching from Xata:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } else if (req.method === 'GET') {
    // Handle GET requests (for example, just return a message)
    res.status(200).json({ message: 'GET request received. You can send a POST request to query the database.' });
  } else {
    // Handle any other HTTP methods
    res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Confirmation message that the server is connected
  const port = process.env.PORT || 3000;  // Default to 3000 if no port is provided
  console.log(`Server connected and running on port ${port}`);
}
