const database = require('../database/database');

async function getHospitalsByName(hospitalName) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      ` 
        SELECT
            hospital_id,
            name
        FROM hospital
        WHERE LOWER(name) LIKE '%' || LOWER(:hospitalName) || '%'
      `,
      {
        hospitalName: hospitalName,
      }
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getHospitalsByName,
};
