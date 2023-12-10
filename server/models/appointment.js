const database = require('../database/database');

async function getAppointmentsForPatient(patientId) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `
      SELECT 
        a.date_examination,
        er.name_room as "Ambulancia",
        er.examination_location_code as "AmbulanciaKod",
        aet.name as "TypVesetrenia",
        mp.name as "LekarskyZakrok"
      FROM appointment a
      JOIN examination_room er ON(a.examination_location_code = er.examination_location_code)
      JOIN appointment_examination_type aet ON(a.examination_type = aet.examination_type_code)
      JOIN medical_procedure mp ON(a.medical_procedure_code = mp.medical_procedure_code)
      WHERE a.patient_id = :patientId`;

    const result = await conn.execute(sqlStatement, { patientId: patientId });
    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function addAppointment(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `
      BEGIN
        add_appointment(
          :dateExamination, 
          :patientId, 
          :examinationLocationCode, 
          :examinationType, 
          :medicalProcedureCode
        );
      END;
    `;

    await conn.execute(sqlStatement, {
      dateExamination: body.dateExamination,
      patientId: body.patientId,
      examinationLocationCode: body.examinationLocationCode,
      examinationType: body.examinationType,
      medicalProcedureCode: body.medicalProcedureCode
    });

    console.log('Appointment added');
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function deleteAppointment(appointmentId) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `
      BEGIN
        delete_appointment(:appointmentId);
      END;
    `;

    await conn.execute(sqlStatement, { appointmentId: appointmentId });

    console.log('Deleted appointment ' + appointmentId);
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}


module.exports = {
  getAppointmentsForPatient,
  addAppointment,
  deleteAppointment
};
