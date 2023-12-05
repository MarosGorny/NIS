const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard-controller');

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
  '/top-diagnoses/:hospitalId/:limitRows',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getTopNDiagnosesByAverageStay
);

router.get(
  '/bloodTypesInDonations/:hospitalId/date/:date',
  //verify.verifyRoles(1, 3),
  //verify.checkForCorrectId(),
  controller.getBloodTypesByDonationsForHospital
);

router.get(
    '/age-category-patient/:hospitalId',
    //verify.verifyRoles(1, 3),
    //verify.checkForCorrectId(),
    controller.getAgeCategoryOfPatientsForHospital
);

router.get(
    '/oldest-patients/:hospitalId/:limitRows',
    //verify.verifyRoles(1, 3),
    //verify.checkForCorrectId(),
    controller.getOldestPatientsForHospital
);

router.get(
    '/all-employees-departments/:hospitalId/:limitRows',
    //verify.verifyRoles(1, 3),
    //verify.checkForCorrectId(),
    controller.getEmployeesInExaminationRoomInDepartmentsForHospital
);


router.get(
    '/age-category-employee/:hospitalId',
    //verify.verifyRoles(1, 3),
    //verify.checkForCorrectId(),
    controller.getAgeCategoryOfEmployeesForHospital
);

router.get(
    '/patient-born-months/:hospitalId/:year',
    //verify.verifyRoles(1, 3),
    //verify.checkForCorrectId(),
    controller.getPatientsBornInMonthForYear
);

module.exports = router;
