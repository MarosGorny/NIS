const prescription = require('../models/prescription');

module.exports = {
  addPrescription: (req, res) => {
    (async () => {
      return_val = await prescription.addPrescription(req.body);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  deletePrescription: (req, res) => {
    (async () => {
      return_val = await prescription.deletePrescription(req.params.id);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getPrescriptionsForPatient: (req, res) => {
    (async () => {
      return_val = await prescription.getPrescriptionsForPatient(req.params.id);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  generatePatientPrescriptions: (req, res) => {
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

  getAllValidPrescriptions: (req, res) => {
    (async () => {
      const return_val = await prescription.getAllValidPrescriptions(req.params.id);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  getAllExpiredPrescriptions: (req, res) => {
    (async () => {
      const return_val = await prescription.getAllExpiredPrescriptions(req.params.id);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  isPrescriptionExpired: (req, res) => {
    (async () => {
      const prescriptionId = req.params.prescriptionId; // Extracting prescriptionId from request parameters
      const return_val = await prescription.isPrescriptionExpired(prescriptionId);
      res.status(200).json({ expiredStatus: return_val });
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  }
};
