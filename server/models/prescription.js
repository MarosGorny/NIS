const database = require('../database/database');

async function addPrescription(body) {
  try {
    let conn = await database.getConnection();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const date = new Date(body.date_expiry);

    const drugArray = body.drugs;

    const drugObjects = drugArray.map((drug) => ({
      DRUG_CODE: drug.drugCode.DRUG_CODE,
      DOSAGE: drug.dosage,
    }));

    const bindVars = {
      p_drugs: {
        type: 'T_INSERT_PRESCRIPTION_N_TABLE',
        dir: database.oracledb.BIND_IN,
        val: drugObjects,
      },
      staffId: body.staff_id,
      patientId: body.patient_id,
      diagnose: body.diagnose,
      date_expiry: date.toLocaleDateString('us-US', options),
    };

    const sqlStatement = `
    BEGIN 
        insert_prescription(:p_drugs, :staffId, :patientId, :diagnose, :date_expiry);
    END;
    `;

    let result = await conn.execute(sqlStatement, bindVars);

    console.log('Prescription inserted ' + JSON.stringify(result));
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function deletePrescription(prescriptionId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `
      BEGIN
        delete_prescription(:prescriptionId);
      END;
      `,
      {
        prescriptionId: prescriptionId,
      }
    );

    console.log('Deleted prescription ' + prescriptionId);
    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getPrescriptionsForPatient(patientId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `
      SELECT 
          p.prescription_id,
          p.date_issued,
          p.date_expiry,
          d.name
      FROM prescription p
      JOIN diagnose d ON d.diagnose_code = p.diagnose_code
      WHERE 
        p.patient_id = :patientId
      ORDER BY 
        p.date_issued
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

async function generatePatientPrescriptions(prescription_id) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `
      SELECT 
          p.prescription_id prescription_id,
          XMLROOT(
            XMLELEMENT("prescription", XMLATTRIBUTES(p.prescription_id AS "PID"),
              XMLELEMENT("date_issued", p.date_issued),
              XMLELEMENT("date_expiry", p.date_expiry),
              XMLELEMENT("prescribed_by", pe.person_info.name || ' ' || pe.person_info.surname),
              XMLELEMENT("drugs", 
                  XMLAGG(
                      XMLELEMENT("drug", XMLATTRIBUTES(pd.drug_code AS "dc"),
                          XMLELEMENT("name", d.name || d.supplement),
                          XMLELEMENT("expiration", d.expiration || ' days'),
                          XMLELEMENT("dosage", pd.dosage || ' a day')
                      )
                  )
              )
            )  
          , version '1.0') xml
      FROM prescription p
      JOIN staff s ON s.staff_id = p.staff_id
      JOIN person pe ON pe.birth_number = s.person_birth_number
      JOIN prescribed_drugs pd ON pd.prescription_id = p.prescription_id
      JOIN drug d ON pd.drug_code = d.drug_code
      WHERE p.prescription_id = :prescription_id
      GROUP BY 
          p.prescription_id,
          p.date_issued,
          p.date_expiry,
          pe.person_info.name,
          pe.person_info.surname
      `,
      {
        prescription_id: prescription_id,
      }
    );

    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getAllValidPrescriptions(patientId) {
  //TODO: Add hospitalId to the query
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `
      SELECT           
            pr.prescription_id,
          pr.date_issued,
          pr.date_expiry,
          d.name AS valid_prescriptions
      FROM prescription pr
      JOIN patient p ON pr.patient_id = p.patient_id
      JOIN diagnose d ON d.diagnose_code = pr.diagnose_code
      WHERE CURRENT_DATE BETWEEN pr.date_issued 
        AND pr.date_expiry 
        AND p.hospital_id = 1
        AND p.patient_id = :patientId
      ORDER BY pr.date_issued
      `,{ 
        patientId: patientId
        }
    );
    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

// Function to get all expired prescriptions for patients in a hospital
async function getAllExpiredPrescriptions(patientId) {
  //TODO: Add hospitalId to the query
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `
      SELECT 
        pr.prescription_id, 
        pr.patient_id, 
        pr.date_issued, 
        pr.date_expiry
      FROM prescription pr 
      JOIN patient p ON pr.patient_id = p.patient_id
      WHERE p.hospital_id = 1
        AND pr.patient_id = :patientId
        AND pr.date_expiry < CURRENT_DATE
      ORDER BY pr.date_expiry DESC
      `, {
        patientId: patientId
      }
    );
    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}


async function isPrescriptionExpired(prescriptionId) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `
      BEGIN
        :return_value := IsPrescriptionExpired(:prescriptionId);
      END;
      `,
      {
        prescriptionId: prescriptionId,
        return_value: { dir: database.oracledb.BIND_OUT, type: database.oracledb.STRING }
      }
    );
    return result.outBinds.return_value;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getPrescriptionsForPatient,
  generatePatientPrescriptions,
  addPrescription,
  deletePrescription,
  getAllValidPrescriptions,
  getAllExpiredPrescriptions,
  isPrescriptionExpired
};
