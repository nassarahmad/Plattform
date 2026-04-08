const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { createRequest, getNearbyRequests, acceptRequest, updateStatus } = require('../controllers/requestController');

router.post('/', protect, authorize('help_seeker', 'organization', 'admin'), createRequest);

router.get('/nearby', protect, authorize('helper', 'admin'), getNearbyRequests);

router.patch('/:id/accept', protect, authorize('helper'), acceptRequest);

router.patch('/:id/status', protect, updateStatus); 

module.exports = router;