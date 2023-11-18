module.exports = {
  getHospitalsByName: (req, res) => {
    const hospital = require('../models/hospital');
    (async () => {
      return_val = await hospital.getHospitalsByName(req.params.query);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
};
