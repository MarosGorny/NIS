module.exports = {
  addPrescription: (req, res) => {
    const prescription = require('../models/prescription');
    (async () => {
      return_val = await prescription.addPrescription(req.body);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  deletePrescription: (req, res) => {
    const prescription = require('../models/prescription');
    (async () => {
      return_val = await prescription.deletePrescription(req.params.id);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getPrescriptionsForPatient: (req, res) => {
    const prescription = require('../models/prescription');
    (async () => {
      return_val = await prescription.getPrescriptionsForPatient(req.params.id);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  generatePatientPrescriptions: (req, res) => {
    const prescription = require('../models/prescription');
    (async () => {
      return_val = await prescription.generatePatientPrescriptions(
        req.params.prescription_id
      );
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
};
