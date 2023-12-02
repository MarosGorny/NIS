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

async function getDiagnoseByCode(code) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `
      SELECT 
          d.name name,
          d.diagnose_code diagnose_code
      FROM 
        diagnose d
      WHERE 
        d.diagnose_code = :code
        `,
      {
        code: code,
      }
    );

    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getDiagnoses,
  getDiagnoseByCode,
};
