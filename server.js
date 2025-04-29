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
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Log environment variables to ensure they are being loaded correctly
  console.log('XATA_API_KEY:', process.env.XATA_API_KEY);  // Should log your API key
  console.log('XATA_DATABASE_URL:', process.env.XATA_DATABASE_URL);  // Should log your database URL

  try {
    // Query data from the 'valorant' table (you can change the query as needed)
    const results = await xata.db.valorant.getMany();
    
    // Send the results back as a response
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching from Xata:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }

  // Confirmation message that the server is connected
  const port = process.env.PORT || 3000;  // Default to 3000 if no port is provided
  console.log(`Server connected and running on port ${port}`);
}
