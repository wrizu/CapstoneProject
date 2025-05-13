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
    query = query.filter('Tournament', filters.tournament);
    appendCondition(`Tournament = '${filters.tournament}'`);
  }

  if (filters.agent) {
    query = query.filter('Agents', filters.agent);
    appendCondition(`Agents = '${filters.agent}'`);
  }

  if (filters.player) {
    query = query.filter('Player', filters.player);
    appendCondition(`Player = '${filters.player}'`);
  }

  if (filters.teams) {
    query = query.filter('Teams', filters.teams);
    appendCondition(`Teams = '${filters.teams}'`);
  }

  // We'll handle numeric filters after fetching the data
  sqlQuery += " ORDER BY KD DESC, Kills DESC"; // Ensure the results are ordered by KD and Kills in descending order

  return query;
};

const formatValue = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : parseFloat(value.toFixed(2));
  }
  return value;
};

const formatRow = (row) => {
  const formatted = {};
  for (const key in row) {
    formatted[key] = formatValue(row[key]);
  }
  return formatted;
};

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const filters = req.body.filters || {};
      console.log('Received filters:', filters);

      const query = buildQuery(filters);
      let results = await query.getAll();

      // Local filtering for numeric inputs
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

        console.log(`Filtered ${key}: ${results.length} match ${key} ${operatorSymbol} ${value}`);
      };

      if (filters.kd) localNumberFilter('KD', filters.kd, 'KD');
      if (filters.kills) localNumberFilter('Kills', filters.kills, 'Kills');
      if (filters.first_kills) localNumberFilter('First_Kills', filters.first_kills, 'First Kills');

      // Sort the results by KD and Kills locally as a backup
      results.sort((a, b) => {
        const kdCompare = parseFloat(b.KD) - parseFloat(a.KD);
        if (kdCompare !== 0) return kdCompare;
        return parseInt(b.Kills) - parseInt(a.Kills); // If KD is the same, sort by Kills
      });

      const formattedResults = results.map(formatRow);
      return res.status(200).json(formattedResults);
    }

    if (req.method === 'GET') {
      const results = await xata.db.players_stats.select().getAll();
      const formattedResults = results.map(formatRow);
      return res.status(200).json(formattedResults);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });

  } catch (err) {
    console.error('Error in query handler:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
