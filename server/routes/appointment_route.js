const express = require('express');
const router = express.Router();
const controller = require('../controllers/appointment-controller');


router.get(
  '/patient/:patientId', 
  controller.getAppointmentsForPatient
  );

router.get(
  '/patient/future/:patientId', 
  controller.getFutureAppointmentsForPatient
  );

router.get(
  '/patient/historical/:patientId', 
  controller.getHistoricalAppointmentsForPatient
  );


router.post(
  '/add',
  controller.addAppointment
);

// router.get(
//   '/delete/:id',
//   controller.deleteAppointment
// );




module.exports = router;
