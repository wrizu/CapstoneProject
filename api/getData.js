const { XataClient } = require('@xata.io/client');

const xata = new XataClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DATABASE_URL,
  branch: process.env.XATA_BRANCH || 'main',
});

module.exports = async (req, res) => {
  try {
    const results = await xata.db.tableName.getAll();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
