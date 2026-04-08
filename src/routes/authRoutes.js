const express = require('express');
const router = express.Router();
const path = require('path');

const { register, login, getMe } = require(path.join(__dirname, '../controllers/authController'));
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../schemas/auth');


router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);

module.exports = router;