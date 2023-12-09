const database = require('../database/database');

async function getStaffById(staffId) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `SELECT * FROM staff WHERE staff_id = :staffId`,
      {
        staffId: staffId,
      }
    );

    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}
async function getDoctorsByHospital(hospitalId) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            ` SELECT person.person_info.NAME || ' ' || person.person_info.SURNAME as nameSurname, staff_id, medical_speciality.name
                FROM staff
                JOIN person ON staff.person_birth_number = person.birth_number
                Join medical_speciality using(medical_speciality_code)
                WHERE staff.medical_occupation_code = '346874'
                and hospital_id = :hospitalId`,
            {
                hospitalId: hospitalId,
            }
        );

        return result.rows;
    } catch (err) {
        throw new Error('Database error: ' + err);
    }
}
async function getNursesByHospital(hospitalId) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            ` SELECT person.person_info.NAME || ' ' || person.person_info.SURNAME as nameSurname, staff_id, medical_speciality.name
                FROM staff
                JOIN person ON staff.person_birth_number = person.birth_number
                Join medical_speciality using(medical_speciality_code)
               where (staff.medical_occupation_code ='347062' or staff.medical_occupation_code ='346908')
                and hospital_id = :hospitalId`,
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
    getStaffById,
    getDoctorsByHospital,
    getNursesByHospital
};
