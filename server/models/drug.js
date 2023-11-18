const database = require('../database/database');

async function getDrugs(drugName) {
  try {
    let conn = await database.getConnection();

    if (!drugName) return [];

    const result = await conn.execute(
      `
        SELECT 
            d.name || d.supplement name,
            d.drug_code
        FROM drug d
        WHERE LOWER(d.name) LIKE '%' || LOWER(:drugName) || '%'
        `,
      {
        drugName: drugName,
      }
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getDrugs,
};
