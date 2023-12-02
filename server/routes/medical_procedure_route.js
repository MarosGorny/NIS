const express = require('express');
const router = express.Router();
const controller = require('../controllers/medical_procedure-controller');
const verify = require('../user_verification/verify_user');

router.get(
  '/:query',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getMedicalProcedures
);
router.get(
  '/code/:code',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getMedicalProcedureByCode
);

module.exports = router;
