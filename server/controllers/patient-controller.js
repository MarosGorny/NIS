module.exports = {
  getPatientsByHospital: (req, res) => {
    const patient = require('../models/patient');
    (async () => {
      return_val = await patient.getPatientsByHospital(req.params.id);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getPatientFormDataByPatientId: (req, res) => {
    const patient = require('../models/patient');
    (async () => {
      return_val = await patient.getPatientFormDataByPatientId(req.params.id);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getVaccinationsHistoryByPatientId: (req, res) => {
    const patient = require('../models/patient');
    (async () => {
      return_val = await patient.getVaccinationsHistoryByPatientId(
        req.params.id
      );
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  updatePatient: (req, res) => {
    const patient = require('../models/patient');
    (async () => {
      try {
        const return_val = await patient.updatePatient(req.body);
        res.status(200).json(return_val);
      } catch (err) {
        console.error(err);
        res.status(403).send(err);
      }
    })();
  },

  addPatient: (req, res) => {
    const patient = require('../models/patient');
    (async () => {
      return_val = await patient.addPatient(req.body);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  deletePatient: (req, res) => {
    const patient = require('../models/patient');
    (async () => {
      return_val = await patient.deletePatient(req.body.birth_number);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
};
