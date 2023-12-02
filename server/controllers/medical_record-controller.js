module.exports = {
  insertMedicalRecord: (req, res) => {
    const medical_record = require('../models/medical_record');
    (async () => {
      return_val = await medical_record.insertMedicalRecord(req.body);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getMedicalRecordById: (req, res) => {
    const medical_record = require('../models/medical_record');
    (async () => {
      return_val = await medical_record.getMedicalRecordById(req.params.id);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getMedicalRecordsForPatient: (req, res) => {
    const medical_record = require('../models/medical_record');
    (async () => {
      return_val = await medical_record.getMedicalRecordsForPatient(
        req.params.id
      );
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getMedicalRecordForPatient: (req, res) => {
    const medical_record = require('../models/medical_record');
    (async () => {
      return_val = await medical_record.getMedicalRecordForPatient(
        req.params.id,
        req.params.recordId
      );
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getMedicalRecordImageForPatient: (req, res) => {
    const medical_record = require('../models/medical_record');
    (async () => {
      return_val = await medical_record.getMedicalRecordImageForPatient(
        req.params.recordId
      );
      if (!return_val) return res.status(200);
      res.status(200).write(return_val.IMAGE, 'binary');
      res.end(null, 'binary');
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
};
