const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth-controller');

// TODO router.post('/register', controller.handleRegister);
router.post('/login', controller.handleLogin);
// TODO router.get('/logout', controller.handleLogout);
// TODO router.get('/refreshToken', controller.handleRefreshToken);

module.exports = router;
