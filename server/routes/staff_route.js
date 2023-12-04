const express = require('express');
const router = express.Router();
const controller = require('../controllers/staff-controller');

router.get(
    '/doctors/hospital/:id',
    //verify.verifyRoles(1, 3),
    //verify.checkForCorrectId(),
    controller.getDoctorsByHospital
);
router.get(
    '/nurses/hospital/:id',
    //verify.verifyRoles(1, 3),
    //verify.checkForCorrectId(),
    controller.getNursesByHospital
);

module.exports = router;