const Review = require('../models/Review');
const HelpRequest = require('../models/HelpRequest');
const User = require('../models/User');
const { sendNotification } = require('../utils/notification');

exports.createReview = async (req, res, next) => {
  try {
    const { requestId, revieweeId, rating, comment } = req.body;

    // check rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'rating must be between 1 and 5' });
    }

    const request = await HelpRequest.findById(requestId);
    if (!request) return res.status(404).json({ success: false, message: 'request not found' });

    if (request.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'can only review completed requests' });
    }

    const reviewerId = req.user._id.toString();

    const isSeeker = request.createdBy.toString() === reviewerId;
    const isHelper = request.assignedHelpers.some(h => h.toString() === reviewerId);

    if (!isSeeker && !isHelper) {
      return res.status(403).json({ success: false, message: 'you are not allowed to review this request' });
    }

    if (!revieweeId) {
      return res.status(400).json({ success: false, message: 'reviewee ID is required' });
    }

    if (revieweeId === reviewerId) {
      return res.status(400).json({ success: false, message: 'you cannot review yourself' });
    }

    const validParticipants = [
      request.createdBy.toString(),
      ...request.assignedHelpers.map(h => h.toString())
    ];

    if (!validParticipants.includes(revieweeId)) {
      return res.status(400).json({
        success: false,
        message: 'the user is not a participant in this request'
      });
    }

    const existing = await Review.findOne({
      request: requestId,
      reviewer: reviewerId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'you have already reviewed this request'
      });
    }

    const review = await Review.create({
      request: requestId,
      reviewer: reviewerId,
      reviewee: revieweeId,
      rating,
      comment,
      type: isSeeker ? 'seeker_to_helper' : 'helper_to_seeker'
    });

    // calculate new rating
    const userReviews = await Review.find({ reviewee: revieweeId });
    const totalRating = userReviews.reduce((sum, r) => sum + r.rating, 0);

    await User.findByIdAndUpdate(revieweeId, {
      averageRating: parseFloat((totalRating / userReviews.length).toFixed(1)),
      reviewCount: userReviews.length
    });

    // send notification (FIXED HERE)
    const io = req.app.get('io');

    await sendNotification(io, revieweeId, {
      sender: reviewerId,
      request: requestId,
      type: 'system',
      title: 'You were reviewed! ⭐',
      message: `${req.user.name} gave you ${rating}/5 stars`,
      reviewId: review._id
    });

    res.status(201).json({
      success: true,
      review
    });

  } catch (err) {
    next(err);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const { userId, requestId } = req.params;

    const query = userId
      ? { reviewee: userId }
      : { request: requestId };

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .populate('reviewer', 'name averageRating')
      .populate('request', 'title category');

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });

  } catch (err) {
    next(err);
  }
};