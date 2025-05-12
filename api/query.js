require('dotenv').config();
const { getXataClient } = require('../src/xata');

const xata = getXataClient({
  databaseURL: process.env.XATA_DATABASE_URL,
  apiKey: process.env.XATA_API_KEY,
  branch: process.env.XATA_BRANCH || 'main',
});

const buildQuery = (filters) => {
  let query = xata.db.players_stats.select();
  let sqlQuery = "SELECT * FROM players_stats";
  let whereAdded = false;

  const appendCondition = (condition) => {
    if (!whereAdded) {
      sqlQuery += ` WHERE ${condition}`;
      whereAdded = true;
    } else {
      sqlQuery += ` AND ${condition}`;
    }
  };

  if (filters.tournament) {
    console.log('Filtering by tournament:', filters.tournament);
    query = query.filter('Tournament', filters.tournament);
    appendCondition(`Tournament = '${filters.tournament}'`);
  }

  if (filters.agent) {
    console.log('Filtering by agent:', filters.agent);
    query = query.filter('Agents', filters.agent);
    appendCondition(`Agents = '${filters.agent}'`);
  }

  if (filters.player) {
    console.log('Filtering by player:', filters.player);
    query = query.filter('Player', filters.player);
    appendCondition(`Player = '${filters.player}'`);
  }

  if (filters.teams) {
    console.log('Filtering by teams:', filters.teams);
    query = query.filter('Teams', filters.teams);
    appendCondition(`Teams = '${filters.teams}'`);
  }

  if (filters.stage) {
    console.log('Filtering by stage:', filters.stage);
    query = query.not('Stage', filters.stage);
    appendCondition(`Stage != '${filters.stage}'`);
  }

  if (filters.match_type) {
    console.log('Filtering by Match Type:', filters.match_type);
    query = query.not('Match_Type', filters.match_type);
    appendCondition(`Match_Type != '${filters.match_type}'`);
  }

  const numberFilter = (field, rawValue) => {
    const match = rawValue.match(/^(>=|<=|<>|>|<|=)?\s*(\d+(\.\d+)?)$/);
    if (match) {
      const op = match[1] || '=';
      const value = match[2];
      appendCondition(`${field} ${op} ${value}`);
      console.log(`Filtering by ${field}: ${op} ${value}`);
    }
  };

  if (filters.kd) numberFilter('KD', filters.kd);
  if (filters.kills) numberFilter('Kills', filters.kills);
  if (filters.first_kills) numberFilter('First_Kills', filters.first_kills);

  query = query.sort('KD', 'desc');
  sqlQuery += " ORDER BY KD DESC";
  console.log('Building query with filters:', filters);
  console.log('Generated SQL query:', sqlQuery);

  return query;
};

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const filters = req.body || {};
      console.log('Received filters:', filters);

      const query = buildQuery(filters);
      const allResults = await query.getAll();

      let results = allResults;

      const localNumberFilter = (field, rawValue, key = field) => {
        const match = rawValue.match(/^(>=|<=|<>|>|<|=)?\s*(\d+(\.\d+)?)$/);
        if (!match) throw new Error(`Invalid ${key} format.`);

        const operatorSymbol = match[1] || '=';
        const value = parseFloat(match[2]);

        const ops = {
          '>': (a, b) => a > b,
          '>=': (a, b) => a >= b,
          '<': (a, b) => a < b,
          '<=': (a, b) => a <= b,
          '=': (a, b) => a === b,
          '<>': (a, b) => a !== b,
        };

        results = results.filter(row => {
          const val = parseFloat(row[field]);
          return !isNaN(val) && ops[operatorSymbol](val, value);
        });

        console.log(`Filtered ${key} results: ${results.length} entries match ${key} ${operatorSymbol} ${value}`);
      };

      if (filters.kd) localNumberFilter('KD', filters.kd, 'KD');
      if (filters.kills) localNumberFilter('Kills', filters.kills, 'Kills');
      if (filters.first_kills) localNumberFilter('First_Kills', filters.first_kills, 'First_Kills');

      results.sort((a, b) => parseFloat(b.KD) - parseFloat(a.KD));

      return res.status(200).json(results);
    }

    if (req.method === 'GET') {
      const results = await xata.db.players_stats.select().getAll();
      return res.status(200).json(results);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });

  } catch (err) {
    console.error('Error in query handler:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
