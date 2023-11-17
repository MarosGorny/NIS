module.exports = {
  getAllMunicipalities: (req, res) => {
    const municipality = require('../models/municipality');
    (async () => {
      ret_val = await municipality.getAllMunicipalities();
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
};
