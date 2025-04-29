import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getXataClient } from './src/xata.js'; // Correct import

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root
dotenv.config({ path: path.resolve(__dirname, '../process.env') });

const app = express();
const PORT = process.env.PORT || 5432;

// Initialize the Xata client using getXataClient function
const xata = getXataClient({
  apiKey: process.env.XATA_API_KEY,   // Your Xata API key
  databaseURL: process.env.XATA_DATABASE_URL,  // The URL of your Xata database
  branch: 'main',  // Default to 'main' branch if not set
});

// Middleware to parse JSON
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../public')));

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// POST endpoint to execute raw SQL queries via Xata's SQL API
app.post('/api/query', async (req, res) => {
  try {
    const { statement } = req.body;

    if (!statement || typeof statement !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid SQL statement.' });
    }

    // Use Xata client to execute the SQL query
    const data = await xata.db.query(statement).execute();

    res.status(200).json(data);
  } catch (error) {
    console.error('SQL API query error:', error);
    res.status(500).json({ error: 'Server error while executing SQL' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
