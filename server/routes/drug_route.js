const express = require('express');
const router = express.Router();
const controller = require('../controllers/drug-controller');
const verify = require('../user_verification/verify_user');

router.get(
  '/:query',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getDrugs
);

module.exports = router;
