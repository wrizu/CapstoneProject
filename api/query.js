const { getXataClient } = require('../src/xata.js');
const dotenv = require('dotenv');
dotenv.config();

const xata = getXataClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DATABASE_URL,
  branch: 'main',
});

module.exports = async function (req, res) {
  const { tournament, player, teams, kd, agent } = req.body;
  console.log('Request received with body:', req.body);
  try {
    const filters = [];

    if (tournament) filters.push({ Tournament: tournament });
    if (player) filters.push({ Player: player });
    if (teams) filters.push({ Teams: teams });
    if (agent) filters.push({ Agents: agent });

    // KD logic with debugging logs
    if (kd !== null && kd !== undefined && kd !== '') {
      const kdString = kd.toString().trim();
      const regex = /^(>=|<=|<>|>|<|=)/;
      const operatorMatch = kdString.match(regex);
      const operator = operatorMatch ? operatorMatch[0] : '=';
      const numberPart = kdString.replace(regex, '').trim();
      const number = parseFloat(numberPart);

      console.log('KD input:', kd);
      console.log('Parsed operator:', operator);
      console.log('Parsed number:', number);

      if (!isNaN(number)) {
        // Log the filter being pushed
        console.log('Pushing KD filter:', { KD: { [operator]: number } });
        filters.push({ KD: { [operator]: number } });
      } else {
        return res.status(400).json({ error: 'Invalid KD value' });
      }
    }

    console.log('Final filters:', filters);

    let query = xata.db.players_stats.filter({ $and: filters }).sort('KD', 'desc');
    const results = await query.getAll();
    res.status(200).json(results);
  } catch (error) {
    console.error('Error in query handler:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
