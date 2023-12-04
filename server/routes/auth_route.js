const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth-controller');

router.post('/register', controller.handleRegister);
router.post('/login', controller.handleLogin);
router.get('/logout', controller.handleLogout);
router.get('/refreshToken', controller.handleRefreshToken);

module.exports = router;
