
const staff = require("../models/staff");
module.exports = {
    getDoctorsByHospital: (req, res) => {
        const staff = require('../models/staff');
        console.log("Doctor controller");
        (async () => {
            ret_val = await staff.getDoctorsByHospital(req.params.id);
            res.status(200).json(ret_val);
        })().catch((err) => {
            console.error(err);
            res.status(403).send(err);
        });
    },

    getNursesByHospital: (req, res) => {
        const staff = require('../models/staff');
        console.log("Nurse controller");
        (async () => {
            ret_val = await staff.getNursesByHospital(req.params.id);
            res.status(200).json(ret_val);
        })().catch((err) => {
            console.error(err);
            res.status(403).send(err);
        });
    },
};