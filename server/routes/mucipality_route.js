const express = require('express');
const router = express.Router();
const controller = require('../controllers/municipality-controller');

router.get('/', controller.getAllMunicipalities);

module.exports = router;
