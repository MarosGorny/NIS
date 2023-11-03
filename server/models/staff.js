const database = require('../database/database');

async function getStaffById(staffId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `SELECT * FROM staff WHERE staff_id = :staffId`,
      {
        staffId: staffId,
      }
    );

    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getStaffById,
};
