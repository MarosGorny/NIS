const express = require('express');
const router = express.Router();
const controller = require('../controllers/medical_record-controller');
const verify = require('../user_verification/verify_user');

router.get(
  '/:id',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getMedicalRecordById
);
router.get(
  '/patient/:id',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getMedicalRecordsForPatient
);
router.get(
  '/patient/:id/record/:recordId',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getMedicalRecordForPatient
);
router.get(
  '/image/record/:recordId',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getMedicalRecordImageForPatient
);
router.post(
  '/insert',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.insertMedicalRecord
);

module.exports = router;
