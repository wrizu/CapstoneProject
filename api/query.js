require('dotenv').config();
const { getXataClient } = require('../src/xata');

const xata = getXataClient({
  databaseURL: process.env.XATA_DATABASE_URL,
  apiKey: process.env.XATA_API_KEY,
  branch: process.env.XATA_BRANCH || 'main',
});

const buildQuery = (filters) => {
  let query = xata.db.players_stats.select();

  if (filters.tournament) query = query.filter('Tournament', filters.tournament);
  if (filters.agent) query = query.filter('Agents', filters.agent);
  if (filters.player) query = query.filter('Player', filters.player);
  if (filters.teams) query = query.filter('Teams', filters.teams);

  if (filters.kd) {
    const match = filters.kd.match(/^(>=|<=|<>|>|<|=)?\s*(\d+(\.\d+)?)$/);
    if (!match) throw new Error('Invalid KD format.');

    const operator = match[1] || '=';
    const value = parseFloat(match[2]);

    if (isNaN(value)) throw new Error('Invalid KD value.');

    const ops = {
      '>': 'gt',
      '>=': 'gte',
      '<': 'lt',
      '<=': 'lte',
      '=': 'eq',
      '<>': 'ne',
    };

    const op = ops[operator];
    if (!op) throw new Error('Unsupported KD operator.');

    query = query.filter('KD', op, value);
  }

  return query;
};

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const filters = req.body || {};
      const query = buildQuery(filters);
      const results = await query.getAll();
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
