require('dotenv').config();
const { getXataClient } = require('../src/xata');

const xata = getXataClient({
  databaseURL: process.env.XATA_DATABASE_URL,
  apiKey: process.env.XATA_API_KEY,
  branch: process.env.XATA_BRANCH || 'main',
});

const buildQuery = (filters, orderBy) => {
  let query = xata.db.overview.select();
  let sqlQuery = "SELECT * FROM overview";
  let whereAdded = false;

  const appendCondition = (condition) => {
    sqlQuery += whereAdded ? ` AND ${condition}` : ` WHERE ${condition}`;
    whereAdded = true;
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

  if (filters.map) {
    query = query.filter('Map', filters.map);
    appendCondition(`Map = '${filters.map}'`);
  }

  // Handle order by descending on orderBy column or default to KD DESC, Kills DESC
  if (orderBy && typeof orderBy === 'string' && orderBy.trim() !== '') {
    const col = orderBy.trim();
    query = query.sort(col, 'desc');
    sqlQuery += ` ORDER BY ${col} DESC`;
  } else {
    query = query.sort('KD', 'desc').sort('Kills', 'desc');
    sqlQuery += " ORDER BY KD DESC, Kills DESC";
  }

  console.log("Built SQL-like query:", sqlQuery);

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

const parseNumericFilter = (rawInput, keyName) => {
  const match = rawInput.match(/^(>=|<=|<>|>|<|=)?\s*(\d+(\.\d+)?)$/);
  if (!match) throw new Error(`Invalid ${keyName} format: ${rawInput}`);
  const operator = match[1] || '=';
  const value = parseFloat(match[2]);
  return { operator, value };
};

const compare = {
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '=': (a, b) => a === b,
  '<>': (a, b) => a !== b,
};

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const filters = req.body.filters || {};
      const orderBy = req.body.orderBy; // get orderBy from request body
      console.log('Received filters:', filters);
      console.log('Order by:', orderBy);

      const query = buildQuery(filters, orderBy);
      let results = await query.getAll();

      // Apply local numeric filters
      const numericFilters = [
        { field: 'KD', raw: filters.kd },
        { field: 'Kills', raw: filters.kills },
        { field: 'First_Kills', raw: filters.first_kills },
      ];

      for (const { field, raw } of numericFilters) {
        if (raw) {
          const { operator, value } = parseNumericFilter(raw, field);
          results = results.filter(row => {
            const val = parseFloat(row[field]);
            return !isNaN(val) && compare[operator](val, value);
          });
          console.log(`Filtered ${field}: ${results.length} match ${operator} ${value}`);
        }
      }

      // Sort fallback only if orderBy is missing, already sorted by buildQuery otherwise
      if (!orderBy || orderBy.trim() === '') {
        results.sort((a, b) => {
          const kdDiff = parseFloat(b.KD) - parseFloat(a.KD);
          return kdDiff !== 0 ? kdDiff : parseFloat(b.Kills) - parseFloat(a.Kills);
        });
      }

      const formattedResults = results.map(formatRow);
      return res.status(200).json(formattedResults);
    }

    if (req.method === 'GET') {
      const results = await xata.db.overview.select().getAll();
      const formattedResults = results.map(formatRow);
      return res.status(200).json(formattedResults);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('Error in query handler:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
