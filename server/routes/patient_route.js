const express = require('express');
const router = express.Router();
const controller = require('../controllers/patient-controller');
const verify = require('../user_verification/verify_user');

router.get(
  '/hospital/:id',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getPatientsByHospital
);

module.exports = router;
