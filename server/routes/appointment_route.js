const express = require('express');
const router = express.Router();
const controller = require('../controllers/appointment-controller');


router.get(
  '/patient/:patientId', 
  controller.getAppointmentsForPatient
  );

router.post(
  '/add',
  controller.addAppointment
);

router.get(
  '/delete/:id',
  controller.deleteAppointment
);




module.exports = router;
