const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAllBadges, getUserBadges } = require('../controllers/badgeController');

router.use(protect);
router.get('/available', getAllBadges);
router.get('/user/:userId', getUserBadges);

module.exports = router;