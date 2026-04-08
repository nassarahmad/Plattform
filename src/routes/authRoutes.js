const express = require('express');
const router = express.Router();
const path = require('path');
const { register, login, getMe } = require(path.join(__dirname, '../controllers/authController'));
const { protect } = require(path.join(__dirname, '../middleware/authMiddleware'));


router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;