const examinationRoom = require("../models/examination_room");
const patient = require("../models/patient");
module.exports = {
    getExaminationRoomsByHospital: (req, res) => {
        const examinationRoom = require('../models/examination_room');
        (async () => {
            return_val = await examinationRoom.getExaminationRoomsByHospital(req.params.id);

            res.status(200).json(return_val);
        })().catch((err) => {
            console.error(err);
            res.status(403).send(err);
        });
    },

    getInformationAboutStaffByID: (req, res) => {
        const examinationRoom = require('../models/examination_room');
        (async () => {
            doctor = await examinationRoom.getInformationAboutStaffByID(req.body.staffId,);
            nurse = await examinationRoom.getInformationAboutStaffByID(req.body.staffId1);
            const x = {doctor, nurse};
            res.status(200).json(x);
        })().catch((err) => {
            console.error(err);
            res.status(403).send(err);
        });
    },

    insertSupplyInRoom: (req, res) => {
        const examinationRoom = require('../models/examination_room');
        (async () => {
            return_val = await examinationRoom.insertSupplyInRoom(req.body.supply,req.body.room);
            res.status(200).json(return_val);
        })().catch((err) => {
            console.error(err);
            res.status(403).send(err);
        });
    },


    updateSupplyInRoom: (req, res) => {
        const examinationRoom = require('../models/examination_room');
        (async () => {
            return_val = await examinationRoom.updateSupplyInRoom(req.body.supply,req.body.room);
            //toto zmenit
            res.status(200).json(return_val);
        })().catch((err) => {
            res.status(403).send(err);
        });
    },

    deleteSupplyInRoom: (req, res) => {
        const examinationRoom = require('../models/examination_room');
        (async () => {
            return_val = await examinationRoom.deleteSupplyInRoom(req.body.supply,req.body.room);
            res.status(200).json(return_val);
        })().catch((err) => {
            console.error(err);
            res.status(403).send(err);
        });
    },

    addExaminationRoom: (req, res) => {
        const examinationRoom = require('../models/examination_room');
        (async () => {
            return_val = await examinationRoom.addExaminationRoom(req.body);
            res.status(200).json(return_val);
        })().catch((err) => {
            console.error(err);
            res.status(403).send(err);
        });
    },

    addExaminationRoomWithSupplies: (req, res) => {
        const examinationRoom = require('../models/examination_room');
        (async () => {
            return_val = await examinationRoom.addExaminationRoomWithSupplies(req.body);
            res.status(200).json(return_val);
        })().catch((err) => {
            console.error(err);
            res.status(403).send(err);
        });
    },


    deleteExaminationRoom:(req, res) => {
        const examinationRoom = require('../models/examination_room');
        (async () => {
            return_val = await examinationRoom.deleteExaminationRoom(req.body.EXAMINATION_LOCATION_CODE);
            res.status(200).json(return_val);
        })().catch((err) => {
            console.error(err);
            res.status(403).send(err);
        });
    },





};