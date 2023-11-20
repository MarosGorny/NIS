const database = require('../database/database');
const oracledb = database.oracledb;
oracledb.fetchAsBuffer = [oracledb.BLOB];

async function insertMedicalRecord(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `
        BEGIN
          insert_medical_record(
            :medicalRecordId, 
            :notes, 
            :testResult,
            :medicalProcedure,
            :diagnose,
            :patientId,
            :doctorId,
            :blobData,
            :fileName,
            :mimeType
          );
        END;
    `;

    let buffer = Buffer.from([0x00]);
    if (body.image_data !== null) {
      buffer = Buffer.from(body.image_data, 'base64');
    }

    await conn.execute(sqlStatement, {
      medicalRecordId: body.medical_record_id || null,
      notes: body.notes,
      testResult: body.test_result,
      medicalProcedure: body.medical_procedure,
      diagnose: body.diagnose,
      patientId: body.patient_id,
      doctorId: body.staff_id,
      blobData: buffer !== null ? buffer : body.image_data,
      fileName: body.file_name,
      mimeType: body.mime_type,
    });
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getMedicalRecordById(recordId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      ` 
        SELECT
          mr.record_id,
          mr.date_of_entry,
          mr.notes,
          mr.test_result test_result,
          mr.medical_procedure_code selected_medical_procedure,
          mr.diagnose_code selected_diagnosis,
          mc.patient_id patient_id,
          mr.doctor_id
        FROM 
          medical_record mr
        JOIN 
          medical_card mc ON mc.card_id = mr.card_id
        WHERE 
          mr.record_id = :recordId
          AND mc.date_until IS NULL
      `,
      {
        recordId: recordId,
      }
    );

    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getMedicalRecordsForPatient(patientId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      ` 
        SELECT
          mr.record_id,
          mr.date_of_entry,
          mp.name procedure_name,
          mr.date_of_update
        FROM 
          medical_record mr
        JOIN 
          medical_card mc ON mc.card_id = mr.card_id
        JOIN
          medical_procedure mp ON mp.medical_procedure_code = mr.medical_procedure_code
        WHERE 
          mc.patient_id = :patientId
          AND mc.date_until IS NULL
      `,
      {
        patientId: patientId,
      }
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getMedicalRecordForPatient(patientId, recordId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      ` 
      SELECT
          mr.date_of_entry,
          mr.notes,
          mr.test_result,
          mp.name procedure_name,
          d.name diagnose_name,
          pe.person_info.name || ' ' || pe.person_info.surname doctor_name,
          mr.date_of_update
      FROM 
          medical_record mr
      JOIN 
          medical_card mc ON mc.card_id = mr.card_id
      JOIN
          medical_procedure mp ON mp.medical_procedure_code = mr.medical_procedure_code
      JOIN 
          diagnose d ON d.diagnose_code = mr.diagnose_code
      JOIN 
          staff s ON s.staff_id = mr.doctor_id
      JOIN 
          person pe ON pe.birth_number = s.person_birth_number
      WHERE 
          mc.patient_id = :patientId
          AND mr.record_id = :recordId
          AND mc.date_until IS NULL
      `,
      {
        patientId: patientId,
        recordId: recordId,
      }
    );

    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getMedicalRecordImageForPatient(recordId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      ` 
      SELECT
          image
      FROM 
          medical_record_image
      WHERE 
          record_id = :recordId
      `,
      {
        recordId: recordId,
      }
    );

    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  insertMedicalRecord,
  getMedicalRecordById,
  getMedicalRecordsForPatient,
  getMedicalRecordForPatient,
  getMedicalRecordImageForPatient,
};
