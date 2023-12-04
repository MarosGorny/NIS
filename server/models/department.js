const database = require("../database/database");

async function getDepartmentByHospital(hospitalId) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            ` select * from department 
                where hospital_id = :hospitalId`,
            {
                hospitalId: hospitalId,
            }
        );
        // console.log(result.rows[0]);


        return result.rows;
    } catch (err) {
        throw new Error('Database error: ' + err);
    }
}
module.exports = {
    getDepartmentByHospital
};