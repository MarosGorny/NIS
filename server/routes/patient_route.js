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
router.get(
  '/formData/:id',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getPatientFormDataByPatientId
);
router.get(
  '/:id/vaccinationHistory',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getVaccinationsHistoryByPatientId
);
router.post(
  '/add',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.addPatient
);
router.post('/update', controller.updatePatient);
router.post(
  '/delete',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.deletePatient
);

module.exports = router;
