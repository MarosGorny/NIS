const oracledb = require('oracledb');
try {
  oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_7' }); // TODO - you need this
} catch (err) {
  console.error('Whoops!');
  console.error(err);
  process.exit(1);
}
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const fs = require('fs');
const path = require('path');

const configFilePath = path.join(
  __dirname,
  '../configuration/db_connection.json'
);

const dbConfig = JSON.parse(fs.readFileSync(configFilePath, 'UTF-8'));

async function getConnection() {
  try {
    return await oracledb.getConnection({
      user: dbConfig.username,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
    });
  } catch (err) {
    console.log(err);
  }
}


module.exports = {
  oracledb,
  getConnection,
};
