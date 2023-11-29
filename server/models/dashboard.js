const database = require('../database/database');

async function getTop10PeopleWithMostBloodDonations(hospitalId, paramDate) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      ` 
        SELECT 
            *
        FROM 
            (
                SELECT 
                    mr.card_id,
                    pe.person_info.name || ' ' || pe.person_info.surname person_name,
                    h.hospital_id,
                    ROW_NUMBER() OVER(PARTITION BY h.hospital_id ORDER BY COUNT(*) DESC) rn,
                    COUNT(*) num_blood_donations
                FROM 
                    medical_record mr
                JOIN medical_card mc ON mc.card_id = mr.card_id
                JOIN patient p ON p.patient_id = mc.patient_id
                JOIN person pe ON pe.birth_number = p.birth_number
                JOIN hospital h ON h.hospital_id = p.hospital_id
                WHERE 
                  h.hospital_id = :hospitalId
                  AND EXTRACT(YEAR FROM mr.date_of_entry) = EXTRACT(YEAR FROM TO_DATE(:year, 'MM-DD-YYYY'))
                GROUP BY 
                    mr.card_id,
                    h.hospital_id,
                    pe.person_info.name,
                    pe.person_info.surname
            ) rank_tab
        WHERE rn <= 10
        ORDER BY rn
      `,
      {
        hospitalId: hospitalId,
        year: paramDate,
      }
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getBloodTypesByDonationsForHospital(hospitalId, paramDate) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      ` 
      SELECT
          SUM(CASE WHEN mc.blood_type = 'A+' THEN 1 ELSE 0 END) "A+",
          SUM(CASE WHEN mc.blood_type = 'A-' THEN 1 ELSE 0 END) "A-",
          SUM(CASE WHEN mc.blood_type = 'B+' THEN 1 ELSE 0 END) "B+",
          SUM(CASE WHEN mc.blood_type = 'B-' THEN 1 ELSE 0 END) "B-",
          SUM(CASE WHEN mc.blood_type = 'AB+' THEN 1 ELSE 0 END) "AB+",
          SUM(CASE WHEN mc.blood_type = 'AB-' THEN 1 ELSE 0 END) "AB-",
          SUM(CASE WHEN mc.blood_type = '0+' THEN 1 ELSE 0 END) "0+",
          SUM(CASE WHEN mc.blood_type = '0-' THEN 1 ELSE 0 END) "0-"
      FROM medical_card mc
      JOIN medical_record mr ON mr.card_id = mc.card_id
      JOIN patient p ON p.patient_id = mc.patient_id
      JOIN hospital h ON h.hospital_id = p.hospital_id
      WHERE 
          mr.medical_procedure_code IN (02089715581, 00000468124)
          AND h.hospital_id = :hospitalId
          AND EXTRACT(YEAR FROM mr.date_of_entry) = EXTRACT(YEAR FROM TO_DATE(:year, 'MM-DD-YYYY'))
      `,
      {
        hospitalId: hospitalId,
        year: paramDate,
      }
    );

    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getFreeSpacesInHospital(hospitalId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `BEGIN
          :result := GetFreeSpacesInHospital(:hospitalId);
       END;`,
      {
        hospitalId: hospitalId,
        result: { dir: database.oracledb.BIND_OUT, type: database.oracledb.CURSOR }
      }
    );

    console.log(result)

    const resultSet = result.outBinds.result;
    const rows = await resultSet.getRows(); 
    await resultSet.close();

    return rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getAppointmentsCountByDate(hospitalId, paramDate = null) {
  try {
    let conn = await database.getConnection();

    let bindVars = {
      hospitalId: hospitalId,
      count: { dir: database.oracledb.BIND_OUT, type: database.oracledb.NUMBER }
    };

    let query = `BEGIN :count := GetAppointmentsCountByDate(:hospitalId`;

    if (paramDate) {
      query += `, TO_DATE(:paramDate, 'MM-DD-YYYY')`;
      bindVars.paramDate = paramDate;
    }

    query += `); END;`;

    const result = await conn.execute(query, bindVars);

    return result.outBinds.count;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}



module.exports = {
  getTop10PeopleWithMostBloodDonations,
  getBloodTypesByDonationsForHospital,
  getFreeSpacesInHospital,
  getAppointmentsCountByDate,
};
