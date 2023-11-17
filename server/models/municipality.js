const database = require('../database/database');

async function getAllMunicipalities() {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(`SELECT * FROM municipality`);

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getAllMunicipalities,
};
