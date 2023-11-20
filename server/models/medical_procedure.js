const database = require('../database/database');

async function getMedicalProcedures(medicalProcedure) {
  try {
    let conn = await database.getConnection();

    if (!medicalProcedure) return [];

    const result = await conn.execute(
      `
        SELECT 
            mp.name,
            mp.medical_procedure_code
        FROM medical_procedure mp
        WHERE LOWER(mp.name) LIKE '%' || LOWER(:medicalProcedure) || '%'
        `,
      {
        medicalProcedure: medicalProcedure,
      }
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getMedicalProcedureByCode(code) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `
        SELECT 
            mp.name,
            mp.medical_procedure_code
        FROM 
          medical_procedure mp
        WHERE 
          mp.medical_procedure_code = :code
        `,
      {
        code: code,
      }
    );

    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getMedicalProcedures,
  getMedicalProcedureByCode,
};
