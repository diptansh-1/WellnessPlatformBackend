const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);

module.exports = router;
