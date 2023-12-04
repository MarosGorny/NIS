const database = require('../database/database');

async function getExaminationLocationCode(roomLocationCode) {
    try {
        let conn = await database.getConnection();

        const result = await conn.execute(
            `select * from examination_room  where examination_location_code = :roomLocationCode`,
            {
                roomLocationCode: roomLocationCode,
            }
        );

        return result.rows[0];
    } catch (err) {
        throw new Error('Database error: ' + err);
    }
}
async function getExaminationRoomsByHospital(hospitalId) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            ` SELECT e.examination_location_code, e.name_room,e.department_location_code,e.doctor_id, e.nurse_id, JSON_QUERY(e.supplies, '$') as supplies
                from examination_room e
                join department on(e.department_location_code = department.department_location_code)
                join hospital using(hospital_id)
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

async function getInformationAboutStaffByID(staffId) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            ` select p.person_info.name || ' ' ||  p.person_info.surname as menoPriezvisko, ms.name as odbor, mo.name as pozicia, mr.name as specializacia  from person p
                join staff on (p. birth_number = staff.person_birth_number)
                join medical_speciality ms using (medical_speciality_code)
                join medical_occupation mo using (medical_occupation_code)
                join medical_worker_role mr using (medical_worker_role_code )
                where staff_id = :staffId`,
            {
                staffId: staffId,
            }
        );
        // console.log(result.rows[0]);


        return result.rows;
    } catch (err) {
        throw new Error('Database error: ' + err);
    }
}

async function insertSupplyInRoom(supply, examinationRoomNumber) {
    const name = String(supply.name);
    const quantity = Number(supply.quantity);
    try {
        let conn = await database.getConnection();
        const sqlStatement = `
        BEGIN
            INSERT_SUPPLY(:name, :quantity, :examinationRoomNumber);
        END;
        `;
        const result = await conn.execute(
            sqlStatement,
            {
                name: name,
                quantity: quantity,
                examinationRoomNumber: examinationRoomNumber
            }
        );

        // console.log(result.rows[0]);

        return result;
    } catch (err) {
        throw new Error('Database error: ' + err);
    }
}

async function updateSupplyInRoom(supply, examinationRoomNumber) {

    const name = String(supply.name);
    const quantity = Number(supply.quantity);
    try {
        let conn = await database.getConnection();
        const sqlStatement = `
        BEGIN
            UPDATE_SUPPLY(:name, :quantity, :examinationRoomNumber);
            commit;
        END;
        `;
        const result = await conn.execute(
            sqlStatement,
            {
                name: name,
                quantity: quantity,
                examinationRoomNumber: examinationRoomNumber
            }
        );

        // console.log(result.rows[0]);

        return result;
    } catch (err) {
        throw new Error('Database error: ' + err);
    }
}

async function deleteSupplyInRoom(supply, examinationRoomNumber) {
    const name = String(supply.name);
    try {
        let conn = await database.getConnection();
        const sqlStatement = `
        BEGIN
            DELETE_SUPPLY(:name, :examinationRoomNumber);
         
        END;
        `;
        const result = await conn.execute(
            sqlStatement,
            {
                name: name,
                examinationRoomNumber: examinationRoomNumber
            }
        );

        // console.log(result.rows[0]);


        return result;
    } catch (err) {
        throw new Error('Database error: ' + err);
    }
}

// pridanie novej ambulancie
async function addExaminationRoom(body) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `
    BEGIN
       add_examination_room (:examinationRoomNumber, :nameExaminationRoom, :department, :doctorID, :nurseID);
    END;   
    `;

        let result = await conn.execute(sqlStatement, {
            examinationRoomNumber: body.examinationRoomNumber,
            nameExaminationRoom: body.nameExaminationRoom,
            department: body.department,
            doctorID: body.doctorID,
            nurseID: body.nurseID,
        });

        console.log('Examination room  inserted ' + result);
    } catch (err) {
        throw new Error('Database error: ' + err);
    }
}


    // pridanie novej ambulancie
    async function addExaminationRoomWithSupplies(body) {
        try {
            let conn = await database.getConnection();
            const sqlStatement = `
    BEGIN
       add_examination_room_with_supplies  (:examinationRoomNumber, :nameExaminationRoom, :department, :doctorID, :nurseID, :supplies);
    END;   
    `;
            let result = await conn.execute(sqlStatement, {
                examinationRoomNumber: { dir: database.BIND_IN, val: body.examinationRoomNumber },
                nameExaminationRoom: { dir: database.BIND_IN, val: body.nameExaminationRoom },
                department: { dir: database.BIND_IN, val: body.department },
                doctorID: { dir: database.BIND_IN, val: body.doctorID },
                nurseID: { dir: database.BIND_IN, val: body.nurseID },
                supplies: { dir: database.BIND_IN, val: body.supplies }
            });


        } catch (err) {
            throw new Error('Database error: ' + err);
        }
    }

async function deleteExaminationRoom(examinationRoomNumber) {

    try {
        let conn = await database.getConnection();
        const sqlStatement = `
    begin
        delete_examination_room(:examinationRoomNumber);
    end;  
    `;

        let result = await conn.execute(sqlStatement, {
            examinationRoomNumber: examinationRoomNumber
        });

        console.log('Examination room delete ' + result);
    } catch (err) {
        throw new Error('Database error: ' + err);
    }
}

module.exports = {
    getExaminationLocationCode,
    insertSupplyInRoom,
    getExaminationRoomsByHospital,
    getInformationAboutStaffByID,
    updateSupplyInRoom,
    deleteSupplyInRoom,
    addExaminationRoom,
    addExaminationRoomWithSupplies,
    deleteExaminationRoom
};
