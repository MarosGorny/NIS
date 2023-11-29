const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard-controller');
const verify = require('../user_verification/verify_user');

router.get(
    '/hospital/free-spaces/:hospitalId', 
    controller.getFreeSpacesInHospital
  );

router.get(
    '/hospital/appointments-count/:hospitalId/:date', 
    controller.getAppointmentsCountByDate
  );

router.get(
  '/top10blood/:hospitalId/date/:date',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getTop10PeopleWithMostBloodDonations
);
router.get(
  '/bloodTypesInDonations/:hospitalId/date/:date',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getBloodTypesByDonationsForHospital
);

module.exports = router;
