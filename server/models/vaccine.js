const database = require('../database/database');

async function insertVaccine(body) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `
         BEGIN
            insert_vaccination_to_patient(:vaccineId, :patientId, :typeVaccination, :dateVaccination, :dateReVaccination, :vaccineDose);
         END;
      `,
      {
        vaccineId: body.vaccine_id,
        patientId: body.patient_id,
        typeVaccination: body.type_vaccination,
        dateVaccination: new Date(body.date_vaccination),
        dateReVaccination: new Date(body.date_re_vaccination),
        vaccineDose: body.dose_vaccine.VACCINE_DOSE_ID
          ? body.dose_vaccine.VACCINE_DOSE_ID
          : body.dose_vaccine,
      }
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function deleteVaccination(vaccinationId, patientId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `
      BEGIN
        delete_vaccination_for_patient(:vaccinationId, :patientId);
      END;
      `,
      {
        vaccinationId: vaccinationId,
        patientId: patientId,
      }
    );

    console.log('Deleted prescription ' + vaccinationId);
    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getVaccineType(typeName) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `
          SELECT 
              v.vaccine_id,
              v.vaccine_name
          FROM 
              vaccine v
          WHERE
              LOWER(v.vaccine_name) LIKE '%' || LOWER(:typeName) || '%'
          `,
      {
        typeName: typeName,
      }
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getInitialVaccineType(typeName) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `
      SELECT 
          v.vaccine_id,
          v.vaccine_name
      FROM 
          vaccine v
      WHERE
          NLSSORT(LOWER(v.vaccine_name), 'NLS_SORT = GENERIC_M_CI') LIKE '%' || NLSSORT(LOWER(:typeName), 'NLS_SORT = GENERIC_M_CI') || '%'
          `,
      {
        typeName: typeName,
      }
    );

    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getVaccinesByDose() {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `
        SELECT 
            vd.vaccine_dose_id,
            vd.vaccine_dose_type
        FROM 
            vaccine_dose vd
          `
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getVaccineByDose(doseName) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `
        SELECT 
            vd.vaccine_dose_id,
            vd.vaccine_dose_type
        FROM 
            vaccine_dose vd
        WHERE 
          LOWER(vd.vaccine_dose_type) LIKE '%' || LOWER(:doseName) || '%'
          `,
      {
        doseName: doseName,
      }
    );

    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getVaccineById(patientId, vaccineId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `
        SELECT 
            vac_hist.*
        FROM 
            medical_card mc, 
            TABLE(mc.vaccination_history) vac_hist 
        WHERE 
            patient_id = :patientId
            AND vac_hist.vaccination_id = :vaccineId
        `,
      {
        patientId: patientId,
        vaccineId: vaccineId,
      }
    );

    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getVaccineById,
  insertVaccine,
  getVaccineType,
  getVaccinesByDose,
  getVaccineByDose,
  getInitialVaccineType,
  deleteVaccination,
};
