const express = require('express');
const router = express.Router();
const controller = require('../controllers/examination_room-controller');
const verify = require('../user_verification/verify_user');

router.get(
    '/hospital/:id',
    //verify.verifyRoles(1, 3),
    //verify.checkForCorrectId(),
    controller.getExaminationRoomsByHospital);
router.post(
    '/staff',
    //verify.verifyRoles(1, 3),
    //verify.checkForCorrectId(),
    controller.getInformationAboutStaffByID);
router.put(
    '/supply',
    //verify.verifyRoles(1, 3),
    //verify.checkForCorrectId(),
    controller.updateSupplyInRoom);
router.post(
    '/supply/insert',
    //verify.verifyRoles(1, 3),
    //verify.checkForCorrectId(),
    controller.insertSupplyInRoom);
router.put(
    '/supply/delete',
    //verify.verifyRoles(1, 3),
    //verify.checkForCorrectId(),
    controller.deleteSupplyInRoom);
router.post(
    '/new-room',
    //verify.verifyRoles(1, 3),
    //verify.checkForCorrectId(),
    controller.addExaminationRoom
);
router.post(
    '/new-room-supplies',
    //verify.verifyRoles(1, 3),
    //verify.checkForCorrectId(),
    controller.addExaminationRoomWithSupplies
);
router.delete(
    '/delete',
    //verify.verifyRoles(1, 3),
    //verify.checkForCorrectId(),
    controller.deleteExaminationRoom
);


module.exports = router;
