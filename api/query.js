import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { tournament, agent, player, teams, kd } = req.body;

  try {
    let baseQuery = `SELECT * FROM players_stats WHERE 1=1`;
    const values = [];
    let i = 1;

    if (tournament) {
      baseQuery += ` AND "Tournament" = $${i++}`;
      values.push(tournament);
    }

    if (agent) {
      baseQuery += ` AND "Agents" = $${i++}`;
      values.push(agent);
    }

    if (player) {
      baseQuery += ` AND "Player" = $${i++}`;
      values.push(player);
    }

    if (teams) {
      baseQuery += ` AND "Teams" = $${i++}`;
      values.push(teams);
    }

    if (kd !== null && kd !== undefined && kd !== '') {
      const kdString = kd.toString().trim();
      const regex = /^(>=|<=|<>|>|<|=)/;
      const operatorMatch = kdString.match(regex);
      const operator = operatorMatch ? operatorMatch[0] : '=';

      const numberPart = kdString.replace(regex, '').trim();
      const number = parseFloat(numberPart);

      if (!isNaN(number)) {
        baseQuery += ` AND "KD" ${operator} $${i++}`;
        values.push(number);
      } else {
        return res.status(400).json({ error: 'Invalid KD value' });
      }
    }

    baseQuery += ` ORDER BY "KD" DESC`;

    const result = await pool.query(baseQuery, values);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('❌ PostgreSQL query error:', error.message);
    return res.status(500).json({ error: 'Database query failed', details: error.message });
  }
}
