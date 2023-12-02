module.exports = {
  getDiagnoses: (req, res) => {
    const diagnose = require('../models/diagnose');
    (async () => {
      return_val = await diagnose.getDiagnoses(req.params.query);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getDiagnoseByCode: (req, res) => {
    const diagnose = require('../models/diagnose');
    (async () => {
      return_val = await diagnose.getDiagnoseByCode(req.params.code);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
};
