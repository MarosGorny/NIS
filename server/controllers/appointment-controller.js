const appointmentModel = require('../models/appointment');

module.exports = {
  getAppointmentsForPatient: (req, res) => {
    (async () => {
      const patientId = req.params.patientId; // Assuming the patient ID is passed as a URL parameter
      const appointments = await appointmentModel.getAppointmentsForPatient(patientId);
      res.status(200).json(appointments);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err.message); // Sending a 500 (Internal Server Error) for any errors
    });
  },
  addAppointment: (req, res) => {
    (async () => {
      await appointmentModel.addAppointment(req.body);
      res.status(200).json({ message: 'Appointment added successfully' });
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err.message);
    });
  },
  deleteAppointment: (req, res) => {
    (async () => {
      await appointmentModel.deleteAppointment(req.params.id);
      res.status(200).json({ message: 'Appointment deleted successfully' });
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err.message);
    });
  },

};
