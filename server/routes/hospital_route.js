const express = require('express');
const router = express.Router();
const controller = require('../controllers/hospital-controller');
const verify = require('../user_verification/verify_user');

router.get(
  '/name/:query',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getHospitalsByName
);

module.exports = router;
