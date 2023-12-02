module.exports = {
  getMedicalProcedures: (req, res) => {
    const medicalProcedure = require('../models/medical_procedure');
    (async () => {
      return_val = await medicalProcedure.getMedicalProcedures(
        req.params.query
      );
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getMedicalProcedureByCode: (req, res) => {
    const medicalProcedure = require('../models/medical_procedure');
    (async () => {
      return_val = await medicalProcedure.getMedicalProcedureByCode(
        req.params.code
      );
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
};
