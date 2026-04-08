const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createReview, getReviews } = require('../controllers/reviewController');

router.use(protect); 

router.post('/', createReview);
router.get('/user/:userId', getReviews);      
router.get('/request/:requestId', getReviews); 

module.exports = router;