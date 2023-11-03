module.exports = {
  getPatientsByHospital: (req, res) => {
    const patient = require('../models/patient');
    (async () => {
      ret_val = await patient.getPatientsByHospital(req.params.id);
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
};
