const express = require('express');
const router = express.Router();
const controller = require('../controllers/department-controller');

router.get(
    '/hospital/:id',
    //verify.verifyRoles(1, 3),
    //verify.checkForCorrectId(),
    controller.getDepartmentByHospital
);

module.exports = router;