const dashboard = require("../models/dashboard");
module.exports = {
  getTop10PeopleWithMostBloodDonations: (req, res) => {
    const dashboard = require('../models/dashboard');
    (async () => {
      return_val = await dashboard.getTop10PeopleWithMostBloodDonations(
        req.params.hospitalId,
        req.params.date
      );
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  getTopNDiagnosesByAverageStay: (req, res) => {
    const dashboard = require('../models/dashboard');
    (async () => {
      const hospitalId = req.params.hospitalId;
      const limitRows = req.params.limitRows;
      const return_val = await dashboard.getTopNDiagnosesByAverageStay(hospitalId, limitRows);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  
  getBloodTypesByDonationsForHospital: (req, res) => {
    const dashboard = require('../models/dashboard');
    (async () => {
      return_val = await dashboard.getBloodTypesByDonationsForHospital(
        req.params.hospitalId,
        req.params.date
      );
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  getFreeSpacesInHospital: (req, res) => {
    const dashboard = require('../models/dashboard');
    (async () => {
      const return_val = await dashboard.getFreeSpacesInHospital(req.params.hospitalId);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err); 
    });
  },

  getAppointmentsCountByDate: (req, res) => {
    const dashboard = require('../models/dashboard');
    (async () => {
      const return_val = await dashboard.getAppointmentsCountByDate(req.params.hospitalId, req.params.date);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err); 
    });
  },
  //getAgeCategoryOfPatientsForHospital

  getAgeCategoryOfPatientsForHospital: (req, res) => {
    const dashboard = require('../models/dashboard');
    (async () => {
      return_val = await dashboard.getAgeCategoryOfPatientsForHospital(
          req.params.hospitalId,
      );
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },


  getOldestPatientsForHospital: (req, res) => {
    const dashboard = require('../models/dashboard');
    (async () => {
      const hospitalId = req.params.hospitalId;
      const limitRows = req.params.limitRows;
      const return_val = await dashboard.getOldestPatientsForHospital(hospitalId, limitRows);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },


  getEmployeesInExaminationRoomInDepartmentsForHospital: (req, res) => {
    const dashboard = require('../models/dashboard');
    (async () => {
      const hospitalId = req.params.hospitalId;
      const limitRows = req.params.limitRows;
      const return_val = await dashboard.getEmployeesInExaminationRoomInDepartmentsForHospital(hospitalId, limitRows);
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  //getAgeCategoryOfEmployeesForHospital
  getAgeCategoryOfEmployeesForHospital: (req, res) => {
    const dashboard = require('../models/dashboard');
    (async () => {
      return_val = await dashboard.getAgeCategoryOfEmployeesForHospital(
          req.params.hospitalId,
      );
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  getPatientsBornInMonthForYear: (req, res) => {
    const dashboard = require('../models/dashboard');
    (async () => {
      const hospitalId = req.params.hospitalId;
      const year = req.params.year;
      return_val = await dashboard.getPatientsBornInMonthForYear(
          hospitalId, year
      );
      res.status(200).json(return_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

};
