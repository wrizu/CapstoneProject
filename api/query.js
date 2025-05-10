require('dotenv').config();
const { getXataClient } = require('../src/xata');

const xata = getXataClient({
  databaseURL: process.env.XATA_DATABASE_URL,
  apiKey: process.env.XATA_API_KEY,
  branch: process.env.XATA_BRANCH || 'main',
});

const buildQuery = (filters) => {
  let query = xata.db.players_stats.select();

  if (filters.tournament) {
    console.log('Filtering by tournament:', filters.tournament);
    query = query.filter('Tournament', filters.tournament);
  }

  if (filters.agent) {
    console.log('Filtering by agent:', filters.agent);
    query = query.filter('Agents', filters.agent);
  }

  if (filters.player) {
    console.log('Filtering by player:', filters.player);
    query = query.filter('Player', filters.player);
  }

  if (filters.teams) {
    console.log('Filtering by teams:', filters.teams);
    query = query.filter('Teams', filters.teams);
  }
  query = query.sort('KD', 'desc');
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

      // Apply KD filtering locally if needed
      if (filters.kd) {
        const match = filters.kd.match(/^(>=|<=|<>|>|<|=)?\s*(\d+(\.\d+)?)$/);
        if (!match) throw new Error('Invalid KD format.');

        const operatorSymbol = match[1] || '=';
        const value = parseFloat(match[2]);
        console.log('KD filter - operator:', operatorSymbol, 'value:', value);

        if (isNaN(value)) throw new Error('Invalid KD value.');

        const ops = {
          '>': 'gt',
          '>=': 'gte',
          '<': 'lt',
          '<=': 'lte',
          '=': 'eq',
          '<>': 'ne',
        };

        const op = ops[operatorSymbol];
        if (!op) throw new Error(`Unsupported KD operator "${operatorSymbol}"`);

        results = allResults.filter(row => {
          const kd = parseFloat(row.KD);
          if (isNaN(kd)) return false;

          switch (op) {
            case 'gt': return kd > value;
            case 'gte': return kd >= value;
            case 'lt': return kd < value;
            case 'lte': return kd <= value;
            case 'eq': return kd === value;
            case 'ne': return kd !== value;
            default: return true;
          }
        });
        console.log(`Filtered KD results: ${results.length} entries match KD ${operatorSymbol} ${value}`);
      }

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
