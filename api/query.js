const { Client } = require('@xata.io/client');

const xata = new Client({
    apiKey: process.env.XATA_API_KEY,  // Use your Xata API key
    database: 'VALORANT'              // Specify your database name here
});

// Querying the database (example)
xata.db.players_stats.query().then(result => {
    res.json(result);
});
