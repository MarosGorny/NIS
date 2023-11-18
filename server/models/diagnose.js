const database = require('../database/database');

async function getDiagnoses(diagnoseName) {
  try {
    let conn = await database.getConnection();

    if (!diagnoseName) return [];

    const result = await conn.execute(
      `
        SELECT 
            d.name name,
            d.diagnose_code diagnose_code
        FROM diagnose d
        WHERE LOWER(d.name) LIKE '%' || LOWER(:diagnoseName) || '%'
        `,
      {
        diagnoseName: diagnoseName,
      }
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getDiagnoses,
};
