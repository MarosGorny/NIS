module.exports = {
  getTop10PeopleWithMostBloodDonations: (req, res) => {
    const dashboard = require('../models/dashboard');
    (async () => {
      return_val = await dashboard.getTop10PeopleWithMostBloodDonations(
        req.params.hospitalId,
        req.params.date
      );
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getBloodTypesByDonationsForHospital: (req, res) => {
    const dashboard = require('../models/dashboard');
    (async () => {
      return_val = await dashboard.getBloodTypesByDonationsForHospital(
        req.params.hospitalId,
        req.params.date
      );
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
};
