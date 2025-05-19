require('dotenv').config();
const { getXataClient } = require('../src/xata');

const xata = getXataClient({
  databaseURL: process.env.XATA_DATABASE_URL,
  apiKey: process.env.XATA_API_KEY,
  branch: process.env.XATA_BRANCH || 'main',
});

const buildQuery = (filters, orderBy) => {
  let query = xata.db.overview.select();

  // Helper for safe string filters - only apply if string and non-empty after trimming
  const applyStringFilter = (field, value) => {
    if (typeof value === 'string' && value.trim() !== '') {
      // For equality, just pass value directly
      query = query.filter({ [field]: value.trim() });
    }
  };

  // Apply string filters
  applyStringFilter('Tournament', filters.tournament);
  applyStringFilter('Agents', filters.agent);
  applyStringFilter('Player', filters.player);
  applyStringFilter('Teams', filters.teams);
  applyStringFilter('Map', filters.map);
  applyStringFilter('Stage', filters.stage);
  applyStringFilter('Match_Type', filters.match_type);
  applyStringFilter('Team_A', filters.team_a);
  applyStringFilter('Team_B', filters.team_b);
  applyStringFilter('Winner', filters.winner);

  // Numeric filters mapping
  const numericFilterMap = {
    kd: 'KD',
    kills: 'Kills',
    first_kills: 'First_Kills',
    teamAScore: 'Team_A_Score',
    teamBScore: 'Team_B_Score',
  };

  Object.entries(numericFilterMap).forEach(([inputKey, columnName]) => {
    const input = filters[inputKey];
    if (typeof input === 'string' && input.trim() !== '') {
      try {
        const { operator, value } = parseNumericFilter(input.trim(), columnName);
        console.log("Operator: ", operator);
        console.log("Value: ", value);
        switch (operator) {
          case '=':
            query = query.filter({ [columnName]: value });
            break;
          case '>':
            query = query.filter({ [columnName]: { $gt: value } });
            break;
          case '>=':
            query = query.filter({ [columnName]: { $ge: value } });
            break;
          case '<':
            query = query.filter({ [columnName]: { $lt: value } });
            break;
          case '<=':
            query = query.filter({ [columnName]: { $le: value } });
            break;
          case '<>':
            query = query.filter({ [columnName]: { $ne: value } });
            break;
        }
      } catch (e) {
        console.warn(`Skipping invalid numeric filter for ${columnName}:`, input);
      }
    }
  });

  // Sorting
  if (typeof orderBy === 'string' && orderBy.trim() !== '') {
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

const formatValue = (key, value) => {
  if (value == null) {
    if (key === 'First_Kills' || key === 'First_Deaths') {
      return 0;
    }
    return "";
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : parseFloat(value.toFixed(2));
  }
  return value;
};

const formatRow = (row) => {
  const formatted = {};
  for (const key in row) {
    formatted[key] = formatValue(key, row[key]);
  }
  return formatted;
};

const parseNumericFilter = (rawInput, keyName) => {
  const match = rawInput.match(/^(>=|<=|<>|>|<|=)?\s*(\d+(\.\d+)?)$/);
  if (!match) throw new Error(`Invalid ${keyName} format: ${rawInput}`);
  const operator = match[1] || '=';
  const value = parseInt(match[2]);
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

      const formattedResults = results.map(row => {
        if (row.First_Deaths == null) {
          row.First_Deaths = 0;
        }
        if (row.First_Kills == null) {
          row.First_Kills = 0;
        }
        return formatRow(row);
      });

      

      return res.status(200).json(formattedResults);
    }

    if (req.method === 'GET') {
      const results = await xata.db.overview.select().getAll();

      const formattedResults = results.map(row => {
        if (row.First_Deaths === null || row.First_Deaths == undefined) {
          row.First_Deaths = 0;
        }
        if (row.First_Kills === null || row.First_Kills == undefined) {
          row.First_Kills = 0;
        }
        return formatRow(row);
      });

      

      return res.status(200).json(formattedResults);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('Error in query handler:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
