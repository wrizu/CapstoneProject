require('dotenv').config();
const { getXataClient } = require('../src/xata');

const xata = getXataClient({
  databaseURL: process.env.XATA_DATABASE_URL,
  apiKey: process.env.XATA_API_KEY,
  branch: process.env.XATA_BRANCH || 'main',
});

const buildQuery = (filters, orderBy) => {
  let query = xata.db.overview.select();

  // String filters
  if (filters.tournament) query = query.filter('Tournament', filters.tournament);
  if (filters.agent) query = query.filter('Agents', filters.agent);
  if (filters.player) query = query.filter('Player', filters.player);
  if (filters.teams) query = query.filter('Teams', filters.teams);
  if (filters.map) query = query.filter('Map', filters.map);
  if (filters.stage) query = query.filter('Stage', filters.stage);
  if (filters.match_type) query = query.filter('Match_Type', filters.match_type);
  if (filters.team_a) {
  query = query.filter('Team_A', filters.team_a);
}
if (filters.team_b) {
  query = query.filter('Team_B', filters.team_b);
}

  // Filter by winning team
  if (filters.winner) {
    query = query.filter('Winner', filters.winner);
  }

  // Numeric filters
  const numericFields = ['KD', 'Kills', 'First_Kills'];
  numericFields.forEach(field => {
    const input = filters[field.toLowerCase()];
    if (input) {
      const { operator, value } = parseNumericFilter(input, field);
      switch (operator) {
        case '=':
          query = query.filter(field, value);
          break;
        case '>':
          query = query.filter(field, v => v > value);
          break;
        case '>=':
          query = query.filter(field, v => v >= value);
          break;
        case '<':
          query = query.filter(field, v => v < value);
          break;
        case '<=':
          query = query.filter(field, v => v <= value);
          break;
        case '<>':
          query = query.filter(field, v => v !== value);
          break;
      }
    }
  });

  // Sorting
  if (orderBy && typeof orderBy === 'string' && orderBy.trim() !== '') {
    const columns = orderBy.split(',').map(c => c.trim()).filter(c => c !== '');
    columns.forEach(col => {
      query = query.sort(col, 'desc');
    });
    console.log('Sorting by:', columns.join(', ') + ' descending');
  } else {
    query = query.sort('KD', 'desc').sort('Kills', 'desc');
    console.log('Sorting by: KD desc, Kills desc');
  }

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

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const filters = req.body.filters || {};
      const orderBy = req.body.orderBy;
      console.log('Received filters:', filters);
      console.log('Order by:', orderBy);

      const query = buildQuery(filters, orderBy);
      const results = await query.getAll();

      const formattedResults = results.map(formatRow);
      return res.status(200).json(formattedResults);
    }

    if (req.method === 'GET') {
      const results = await xata.db.overview.select().limit(100).getAll();
      const formattedResults = results.map(formatRow);
      return res.status(200).json(formattedResults);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('Error in query handler:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
