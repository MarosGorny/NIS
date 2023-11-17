const database = require('../database/database');

async function userExists(userid) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT count(*) as pocet FROM users where user_id = :userid`,
      [userid]
    );

    if (result.rows[0].POCET === 1) {
      return true;
    }

    return false;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function insertUser(body) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `INSERT INTO users VALUES(:userid, :pwd, null, :role)`,
      {
        userid: body.userid,
        pwd: body.pwd,
        role: body.role,
      },
      { autoCommit: true }
    );

    console.log('Rows inserted ' + result.rowsAffected);
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getUserByUserId(userid) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `SELECT * FROM users WHERE user_id = :userid`,
      {
        userid: userid,
      }
    );

    console.log(result.rows);
    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getUserByRefreshToken(refresh_token) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `SELECT * FROM users WHERE refresh_token = :refresh_token`,
      {
        refresh_token: refresh_token,
      }
    );

    console.log(result.rows);
    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function updateUserRefreshToken(body) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `UPDATE users SET refresh_token = :refresh_token WHERE user_id = :userid`,
      {
        refresh_token: body.refresh_token,
        userid: body.userid,
      },
      { autoCommit: true }
    );

    console.log('Rows updated ' + result.rowsAffected);
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  userExists,
  insertUser,
  getUserByUserId,
  getUserByRefreshToken,
  updateUserRefreshToken,
};
