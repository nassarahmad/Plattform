const express = require('express');
const router = express.Router();
const { protect, authorize,isResourceOwner } = require('../middleware/authMiddleware');
const { createRequest, getNearbyRequests, acceptRequest, updateStatus }
 = require('../controllers/requestController');
 const validate = require('../middleware/validate');
const { createRequestSchema } = require('../schemas/request');

router.post('/', protect, authorize('help_seeker', 'organization', 'admin'), validate(createRequestSchema), createRequest);
router.get('/nearby', protect, authorize('helper', 'admin'), getNearbyRequests);
router.patch('/:id/accept', protect, authorize('helper'), acceptRequest);
router.patch('/:id/status', protect, updateStatus); 
router.patch('/:id/status', protect, isResourceOwner, updateStatus);

module.exports = router;