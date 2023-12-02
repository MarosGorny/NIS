module.exports = {
  insertVaccine: (req, res) => {
    const vaccine = require('../models/vaccine');
    (async () => {
      return_val = await vaccine.insertVaccine(req.body);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  deleteVaccineForPatient: (req, res) => {
    const vaccine = require('../models/vaccine');
    (async () => {
      return_val = await vaccine.deleteVaccination(
        req.params.vaccineId,
        req.params.patientId
      );
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getVaccineById: (req, res) => {
    const vaccine = require('../models/vaccine');
    (async () => {
      return_val = await vaccine.getVaccineById(
        req.params.patientId,
        req.params.vaccineId
      );
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getVaccinesByType: (req, res) => {
    const vaccine = require('../models/vaccine');
    (async () => {
      return_val = await vaccine.getVaccineType(req.params.vaccineTypeName);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getInitialVaccineByType: (req, res) => {
    const vaccine = require('../models/vaccine');
    (async () => {
      return_val = await vaccine.getInitialVaccineType(
        req.params.vaccineTypeName
      );
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getVaccinesByDose: (req, res) => {
    const vaccine = require('../models/vaccine');
    (async () => {
      return_val = await vaccine.getVaccinesByDose();
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getVaccineByDoseName: (req, res) => {
    const vaccine = require('../models/vaccine');
    (async () => {
      return_val = await vaccine.getVaccineByDose(req.params.doseName);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
};
