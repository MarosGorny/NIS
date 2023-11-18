const express = require('express');
const router = express.Router();
const controller = require('../controllers/prescription-controller');

router.post(
  '/add',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.addPrescription
);
router.delete(
  '/delete/:id',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.deletePrescription
);
router.get(
  '/patient/:id',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getPrescriptionsForPatient
);
router.get(
  '/xml/:prescription_id',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.generatePatientPrescriptions
);

module.exports = router;
