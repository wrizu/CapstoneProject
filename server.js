import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const PORT = process.env.PORT || 5432;  // Make sure your port is correctly set

app.use(bodyParser.json());  // Middleware to parse JSON bodies

// Handle GET request for testing
app.get('/api/query', (req, res) => {
    res.json({ message: "GET request received. You can send a POST request to query the database." });
});

// Handle POST request to query the database
app.post('/api/query', (req, res) => {
    const { query } = req.body;  // Get the query from the request body

    if (!query) {
        return res.status(400).json({ error: 'No query provided' });
    }

    // Example: Execute the query against your database here
    // For now, we will just return the query for testing purposes
    // (replace this with actual DB logic)
    res.json({ success: true, query: query });  // Send back the query as a response
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server connected and running on port ${PORT}`);
});
