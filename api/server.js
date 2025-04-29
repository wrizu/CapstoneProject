const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Function to perform the aggregation (AVG KD per Agent)
function aggregateData() {
    // Read data from JSON file
    const data = JSON.parse(fs.readFileSync('players_stats.json', 'utf8'));

    // Create a dictionary to store KD sums and counts per agent
    const agentsData = {};

    // Loop through each player's data and aggregate
    data.forEach(player => {
        if (!agentsData[player.Agents]) {
            agentsData[player.Agents] = { totalKD: 0, count: 0 };
        }
        agentsData[player.Agents].totalKD += player.KD;
        agentsData[player.Agents].count += 1;
    });

    // Now calculate the average KD for each agent
    const result = [];
    for (const agent in agentsData) {
        const avgKd = agentsData[agent].totalKD / agentsData[agent].count;
        result.push({ Agents: agent, avg_kd: avgKd });
    }

    // Sort by avg_kd in descending order
    result.sort((a, b) => b.avg_kd - a.avg_kd);

    return result;
}

// Define route to get aggregated data
app.get('/complex-query', (req, res) => {
    const results = aggregateData();
    res.json(results);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
