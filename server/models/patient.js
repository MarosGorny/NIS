const database = require('../database/database');

async function getPatientById(patientId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `select * from patient where patient_id = :patientId`,
      {
        patientId: patientId,
      }
    );

    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getPatientsByHospital(hospitalId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      ` SELECT 
            pa.patient_id,
            pa.birth_number, 
            pe.postal_code, 
            pe.person_info.name AS name, 
            pe.person_info.surname AS surname
        FROM patient pa 
        JOIN person pe ON pe.birth_number = pa.birth_number
        WHERE 
            hospital_id = :hospitalId
        OFFSET 1 ROWS FETCH FIRST 100 ROWS ONLY`,
      {
        hospitalId: hospitalId,
      }
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getPatientById,
  getPatientsByHospital,
};
