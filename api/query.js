const { getXataClient } = require('../src/xata.js');

// Initialize Xata client
const xata = getXataClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DATABASE_URL,
  branch: 'main', // You can modify this if you have different branches
});

module.exports = async function (req, res) {
  const { tournament, player, teams, kd } = req.body;

  try {
    let query = xata.db.players_stats;

    // Filter by tournament if provided
    if (tournament) {
      query = query.filter({ Tournament: tournament });
    }

    // Filter by player if provided
    if (player) {
      query = query.filter({ Player: player });
    }

    // Filter by teams if provided
    if (teams) {
      query = query.filter({ Teams: teams });
    }

    // Handle KD filtering like before
    if (kd !== null && kd !== undefined && kd !== '') {
      const kdString = kd.toString().trim();
      const regex = /^(>=|<=|<>|>|<|=)/;
      const operatorMatch = kdString.match(regex);
      const operator = operatorMatch ? operatorMatch[0] : '=';

      const numberPart = kdString.replace(regex, '').trim();
      const number = parseFloat(numberPart);

      if (!isNaN(number)) {
        query = query.filter({ KD: { [operator]: number } });
      } else {
        return res.status(400).json({ error: 'Invalid KD value' });
      }
    }

    // Add ORDER BY "KD" DESC
    query = query.sort('KD', 'desc');

    // Execute the query and fetch the results
    const results = await query.getAll();

    // Send the results as the response
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
