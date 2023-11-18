module.exports = {
  getDrugs: (req, res) => {
    const drug = require('../models/drug');
    (async () => {
      return_val = await drug.getDrugs(req.params.query);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
};
