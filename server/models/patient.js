const database = require('../database/database');

async function getPatientById(patientId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `SELECT * FROM patient WHERE patient_id = :patientId`,
      {
        patientId: patientId,
      }
    );

    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getPatientFormDataByPatientId(patientId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `
      SELECT 
          pe.person_info.name name,
          pe.person_info.surname surname,
          pe.birth_number,
          pe.postal_code,
          pe.person_info.address address,
          p.date_from,
          pe.person_info.email email
      FROM 
          patient p
      JOIN 
          person pe ON pe.birth_number = p.birth_number
      WHERE 
        patient_id = :patientId
      `,
      {
        patientId: patientId,
      }
    );

    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getVaccinationsHistoryByPatientId(patientId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `
      SELECT 
          vh.vaccination_id,
          vh.vaccine_name, 
          vh.vaccination_date, 
          vh.vaccination_next_date, 
          vh.vaccination_dose,
          mc.patient_id
      FROM 
          medical_card mc, 
          TABLE(mc.vaccination_history) vh
      WHERE patient_id = :patientId`,
      {
        patientId: patientId,
      }
    );

    return result.rows;
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
            hospital_id = :hospitalId AND
            date_to IS NULL`,
      {
        hospitalId: hospitalId,
      }
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function addPatient(body) {
  const conn = await database.getConnection();

  console.log(body);

  try {
    const sqlStatement = `
    BEGIN
      add_patient(:birth_number, :name, :surname, :postal_code, :hospital_id, :address, :email, :date_from, :date_to, :doctor_id);
    END;
    `;

    let result = await conn.execute(sqlStatement, {
      birth_number: body.birth_number,
      name: body.name,
      surname: body.surname,
      postal_code: body.postal_code.POSTAL_CODE,
      hospital_id: body.hospital_id,
      email: body.email,
      address: body.address,
      date_from: new Date(body.date_from),
      date_to: body.date_to ? new Date(body.date_to) : null,
      doctor_id: body.doctor_id,
    });

    console.log('Patient inserted ' + result);
  } catch (err) {
    conn.rollback();
    throw new Error('Database error: ' + err);
  }
}

async function updatePatient(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `
    BEGIN
      update_patient(:patient_id, :birth_number, :name, :surname, :postal_code, :hospital_id, :address, :email, :date_from);
    END;
    `;

    await conn.execute(sqlStatement, {
      patient_id: body.patient_id,
      birth_number: body.birth_number,
      name: body.name,
      surname: body.surname,
      postal_code: body.postal_code.POSTAL_CODE || body.postal_code,
      hospital_id: body.hospital_id,
      email: body.email,
      address: body.address,
      date_from: body.date_from,
    });

    console.log('Patient updated');
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function deletePatient(patientBirthNumber) {
  try {
    let conn = await database.getConnection();

    await conn.execute(
      `
        UPDATE patient 
        SET date_to = sysdate
        WHERE birth_number = :birth_number
      `,
      {
        birth_number: patientBirthNumber,
      },
      { autoCommit: true }
    );
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getPatientById,
  getPatientsByHospital,
  addPatient,
  updatePatient,
  deletePatient,
  getVaccinationsHistoryByPatientId,
  getPatientFormDataByPatientId,
};
