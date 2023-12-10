const { log } = require('console');
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

async function getTopNDiagnosesByAverageStay(hospitalId, limitRows = 10) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `
        SELECT 
            pr.diagnose_code,
            d.name AS diagnosis_name,
            AVG(pwr.date_until - pwr.date_from) AS average_stay_duration
        FROM 
            prescription pr
        JOIN 
            diagnose d ON pr.diagnose_code = d.diagnose_code
        JOIN 
            patient_in_ward_room pwr ON pr.patient_id = pwr.patient_id
        JOIN 
            patient pt ON pwr.patient_id = pt.patient_id
        JOIN 
            hospital h ON pt.hospital_id = h.hospital_id
        WHERE 
            pwr.date_from IS NOT NULL AND 
            pwr.date_until IS NOT NULL AND 
            h.hospital_id = :hospitalId
        GROUP BY 
            pr.diagnose_code, d.name
        ORDER BY 
            average_stay_duration DESC, d.name ASC
        FETCH FIRST :limitRows ROWS ONLY
      `,
      {
        hospitalId: hospitalId,
        limitRows: limitRows,
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

    let query = `BEGIN :count := GET_APPOINTMENTS_COUNT_BY_DATE(:hospitalId`;

    if (paramDate) {
      query += `, TO_DATE(:paramDate, 'DD-MON-YY')`;
      bindVars.paramDate = paramDate;
    }

    query += `); END;`;

    console.log(query);
    console.log(bindVars);

    const result = await conn.execute(query, bindVars);

    return result.outBinds.count;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}
async function getAgeCategoryOfPatientsForHospital(hospitalId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
        `SELECT
  COUNT(CASE WHEN age BETWEEN 0 AND 1 THEN 1 ELSE NULL END) AS "Dojča(0-1r)",
  COUNT(CASE WHEN age BETWEEN 2 AND 4 THEN 1 ELSE NULL END) AS "Batoľa(2-4r)",
  COUNT(CASE WHEN age BETWEEN 5 AND 12 THEN 1 ELSE NULL END) AS "Dieťa(5-12r)",
  COUNT(CASE WHEN age BETWEEN 13 AND 19 THEN 1 ELSE NULL END) AS "Dospievajúci(13-19r)",
  COUNT(CASE WHEN age BETWEEN 20 AND 39 THEN 1 ELSE NULL END) AS "Dospelý(20-39r)",
  COUNT(CASE WHEN age BETWEEN 40 AND 59 THEN 1 ELSE NULL END) AS "Dospelý v strednom veku(40-59r)",
  COUNT(CASE WHEN age >= 60 THEN 1 ELSE NULL END) AS "Starší dospelí(60+)r"
FROM (
  SELECT
    FLOOR(MONTHS_BETWEEN(SYSDATE, F_BIRTH_DATE(birth_number)) / 12) AS age
  FROM
    patient
  WHERE patient.hospital_id = :hospitalId
)`,
        {
          hospitalId: hospitalId,
        }
    );

    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getAgeCategoryOfEmployeesForHospital(hospitalId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
        `SELECT
  COUNT(CASE WHEN age BETWEEN 20 AND 39 THEN 1 ELSE NULL END) AS "Dospelý(20-39r)",
  COUNT(CASE WHEN age BETWEEN 40 AND 59 THEN 1 ELSE NULL END) AS "Dospelý v strednom veku(40-59r)",
  COUNT(CASE WHEN age >= 60 THEN 1 ELSE NULL END) AS "Starší dospelí(60+)r"
FROM (
  SELECT
    FLOOR(MONTHS_BETWEEN(SYSDATE, F_BIRTH_DATE(person_birth_number)) / 12) AS age
  FROM
    staff
  WHERE staff.hospital_id = :hospitalId
)`,
        {
          hospitalId: hospitalId,
        }
    );
    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getOldestPatientsForHospital(hospitalId, limitRows = 3) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
        `SELECT
    name,
    surname,
    birth_number,
    TO_CHAR(birth_date, 'DD.MM.YYYY') AS birth_date,
    age
FROM (
    SELECT
        p.person_info.name AS name,
        p.person_info.surname AS surname,
        birth_number,
        F_BIRTH_DATE(birth_number) AS birth_date,
        FLOOR(MONTHS_BETWEEN(SYSDATE, F_BIRTH_DATE(birth_number)) / 12) AS age 
    FROM
        patient
    JOIN
        person p USING (birth_number)
    WHERE
        patient.hospital_id = :hospitalId
    ORDER BY birth_date ASC
)
WHERE ROWNUM <= :limitRows`,
        {
          hospitalId: hospitalId,
          limitRows: limitRows,
        }
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}



async function getEmployeesInExaminationRoomInDepartmentsForHospital(hospitalId, limitRows = 20) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
        `SELECT
    DEPARTMENT_LOCATION_CODE,
    DEPARTMENT_NAME,
    numbers_doctors,
    numbers_nurses
FROM (
    SELECT
        d.DEPARTMENT_LOCATION_CODE,
        d.NAME AS DEPARTMENT_NAME,
        COUNT(DISTINCT er.DOCTOR_ID) AS numbers_doctors,
        COUNT(DISTINCT er.NURSE_ID) AS numbers_nurses,
        ROW_NUMBER() OVER (ORDER BY COUNT(DISTINCT er.DOCTOR_ID) DESC) AS row_number
    FROM
        DEPARTMENT d
    LEFT JOIN
        EXAMINATION_ROOM er ON d.DEPARTMENT_LOCATION_CODE = er.DEPARTMENT_LOCATION_CODE
    WHERE
        d.HOSPITAL_ID = :hospitalId
    GROUP BY
        d.DEPARTMENT_LOCATION_CODE, d.NAME
)
WHERE
    row_number <= :limitRows`,
        {
          hospitalId: hospitalId,
          limitRows: limitRows,
        }
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getPatientsBornInMonthForYear(hospitalId, year = 2022) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
        `SELECT
    COUNT(CASE WHEN TO_CHAR(birth_date, 'MM') = '01' THEN 1 END) AS january,
    COUNT(CASE WHEN TO_CHAR(birth_date, 'MM') = '02' THEN 1 END) AS february,
    COUNT(CASE WHEN TO_CHAR(birth_date, 'MM') = '03' THEN 1 END) AS march,
    COUNT(CASE WHEN TO_CHAR(birth_date, 'MM') = '04' THEN 1 END) AS april,
    COUNT(CASE WHEN TO_CHAR(birth_date, 'MM') = '05' THEN 1 END) AS may,
    COUNT(CASE WHEN TO_CHAR(birth_date, 'MM') = '06' THEN 1 END) AS june,
    COUNT(CASE WHEN TO_CHAR(birth_date, 'MM') = '07' THEN 1 END) AS july,
    COUNT(CASE WHEN TO_CHAR(birth_date, 'MM') = '08' THEN 1 END) AS august,
    COUNT(CASE WHEN TO_CHAR(birth_date, 'MM') = '09' THEN 1 END) AS september,
    COUNT(CASE WHEN TO_CHAR(birth_date, 'MM') = '10' THEN 1 END) AS october,
    COUNT(CASE WHEN TO_CHAR(birth_date, 'MM') = '11' THEN 1 END) AS november,
    COUNT(CASE WHEN TO_CHAR(birth_date, 'MM') = '12' THEN 1 END) AS december
FROM (
    SELECT
        F_BIRTH_DATE(birth_number) AS birth_date
    FROM
        patient
    WHERE
        patient.hospital_id = :hospitalId
        AND TO_CHAR( F_BIRTH_DATE(birth_number), 'YYYY') = :year
)`,
        {
          hospitalId: hospitalId,
          year: year,
        }
    );
    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getPatientsByGenderForHospital(hospitalId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
        `SELECT 
     SUM(CASE WHEN SUBSTR(birth_number, 3, 1) IN (0, 1, 2, 3) THEN 1 ELSE 0 END) Muži,
     SUM(CASE WHEN SUBSTR(birth_number, 3, 1) IN (5, 6, 7, 8) THEN 1 ELSE 0 END) Ženy
        FROM patient where hospital_id=:hospitalId`,
        {
          hospitalId: hospitalId,
        }
    );
    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}





module.exports = {
  getTop10PeopleWithMostBloodDonations,
  getBloodTypesByDonationsForHospital,
  getFreeSpacesInHospital,
  getAppointmentsCountByDate,
  getTopNDiagnosesByAverageStay,
  getAgeCategoryOfPatientsForHospital,
  getOldestPatientsForHospital,
  getEmployeesInExaminationRoomInDepartmentsForHospital,
  getAgeCategoryOfEmployeesForHospital,
  getPatientsBornInMonthForYear,
  getPatientsByGenderForHospital
};
