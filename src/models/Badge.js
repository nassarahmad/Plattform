const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  description: String,
  icon: { type: String, default: '🏅' },
  requirements: {
    metric: { type: String, enum: ['completed_requests', 'avg_rating', 'review_count', 'account_age_days'], required: true },
    threshold: { type: Number, required: true }
  },
  xpReward: { type: Number, default: 50 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Badge', badgeSchema);