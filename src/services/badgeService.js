const Badge = require('../models/Badge');
const User = require('../models/User');
const HelpRequest = require('../models/HelpRequest');
const Review = require('../models/Review');
const { sendNotification } = require('../utils/notification');

/**
 * 
 * @param {String} userId 
 * @param {Object} io -
 */
async function checkAndAwardBadges(userId, io) {
  const user = await User.findById(userId);
  if (!user) return [];

  const availableBadges = await Badge.find({ isActive: true });
  const newlyAwarded = [];

  for (const badge of availableBadges) {
    if (user.badges.includes(badge._id)) continue; 

    let conditionMet = false;
    switch (badge.requirements.metric) {
      case 'completed_requests':
        const completed = await HelpRequest.countDocuments({ assignedHelpers: user._id, status: 'completed' });
        conditionMet = completed >= badge.requirements.threshold;
        break;
      case 'avg_rating':
        conditionMet = user.averageRating >= badge.requirements.threshold;
        break;
      case 'review_count':
        const reviews = await Review.countDocuments({ reviewee: user._id });
        conditionMet = reviews >= badge.requirements.threshold;
        break;
      case 'account_age_days':
        const age = (Date.now() - user.createdAt) / (1000 * 60 * 60 * 24);
        conditionMet = age >= badge.requirements.threshold;
        break;
    }

    if (conditionMet) {
      user.badges.push(badge._id);
      user.xp += badge.xpReward;
      
      user.level = Math.floor(user.xp / 100) + 1;
      newlyAwarded.push(badge);
    }
  }

  if (newlyAwarded.length > 0) {
    await user.save();
    if (io) {
      await sendNotification(io, userId, {
        type: 'system',
        title: '🎉 I got a new badge!',
        message: `Congratulations! You earned: ${newlyAwarded.map(b => b.name).join(', ')}`,
        sender: null,
        request: null
      });
    }
  }

  return newlyAwarded;
}

module.exports = { checkAndAwardBadges };