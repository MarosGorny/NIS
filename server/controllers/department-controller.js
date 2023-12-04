const department = require("../models/department");
module.exports = {
    getDepartmentByHospital: (req, res) => {
        console.log("controller;")
        console.log(res);
        const department = require('../models/department');
        (async () => {
            ret_val = await department.getDepartmentByHospital(req.params.id);
            res.status(200).json(ret_val);
        })().catch((err) => {
            console.error(err);
            res.status(403).send(err);
        });
    },
};