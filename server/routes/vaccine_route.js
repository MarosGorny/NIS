const express = require('express');
const router = express.Router();
const controller = require('../controllers/vaccine-controller');
const verify = require('../user_verification/verify_user');

router.get(
  '/:vaccineId/patient/:patientId',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getVaccineById
);
router.get(
  '/type/:vaccineTypeName',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getVaccinesByType
);
router.get(
  '/type/initial/:vaccineTypeName',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getInitialVaccineByType
);
router.get(
  '/dose',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getVaccinesByDose
);
router.get(
  '/dose/:doseName',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getVaccineByDoseName
);
router.post(
  '/insert/:patientId',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.insertVaccine
);
router.delete(
  '/:vaccineId/patient/:patientId',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.deleteVaccineForPatient
);

module.exports = router;
