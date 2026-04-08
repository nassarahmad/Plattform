const Badge = require('../models/Badge');
const User = require('../models/User');

exports.getAllBadges = async (req, res, next) => {
  try {
    const badges = await Badge.find({ isActive: true }).sort({ xpReward: 1 });
    res.json({ success: true, count: badges.length,  badges });
  } catch (err) { next(err); }
};

exports.getUserBadges = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('badges', 'name description icon xpReward requirements')
      .select('badges xp level averageRating reviewCount');
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true,  user });
  } catch (err) { next(err); }
};