import { Client } from '@xata.io/client';

const xataClient = new Client({
    apiKey: process.env.XATA_API_KEY,
    baseURL: 'https://your-database.xata.sh/db/valorant' // Update with your actual database URL
});

export default async function handler(req, res) {
    const { query } = req.body;

    try {
        const results = await xataClient.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
}
