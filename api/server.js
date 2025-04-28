const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// MySQL config for XAMPP
const db = mysql.createConnection({
    host: '127.0.0.1',  // use IP instead of 'localhost' to avoid socket issues
    user: 'root',
    password: '',
    database: 'valorant',
    port: 3306           // use the correct port here
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database!');
});

app.post('/execute-query', (req, res) => {
    const query = req.body.query;
    if (!query) {
        return res.status(400).json({ error: 'No query provided' });
    }

    db.query(query, (err, results) => {
        if (err) {
            console.error('SQL error:', err);
            return res.status(500).json({ error: err.sqlMessage });
        }
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
