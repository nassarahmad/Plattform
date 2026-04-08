require('dotenv').config();
const mongoose = require('mongoose');
const Badge = require('../src/models/Badge');

const defaultBadges = [
  { 
    code: 'welcome',
    name: 'Welcome',
    description: 'You joined the ZQOORT platform',
    icon: '👋',
    requirements: { metric: 'account_age_days', threshold: 0 },
    xpReward: 10
  },
  { 
    code: 'first_help',
    name: 'First Help',
    description: 'You completed your first help request',
    icon: '🆘',
    requirements: { metric: 'completed_requests', threshold: 1 },
    xpReward: 50
  },
  { 
    code: 'trusted_helper',
    name: 'Trusted Helper',
    description: 'You successfully completed 5 requests',
    icon: '🛡️',
    requirements: { metric: 'completed_requests', threshold: 5 },
    xpReward: 200
  },
  { 
    code: 'five_star',
    name: 'Five Stars',
    description: 'You achieved an average rating of 4.5+',
    icon: '⭐',
    requirements: { metric: 'avg_rating', threshold: 4.5 },
    xpReward: 150
  },
  { 
    code: 'active_member',
    name: 'Active Member',
    description: 'You received 10 reviews',
    icon: '🔥',
    requirements: { metric: 'review_count', threshold: 10 },
    xpReward: 300
  },
  { 
    code: 'rapid_responder',
    name: 'Rapid Responder',
    description: 'You accepted 3 requests within a week',
    icon: '⚡',
    requirements: { metric: 'completed_requests', threshold: 3 },
    xpReward: 100
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Badge.deleteMany({});
  await Badge.insertMany(defaultBadges);
  console.log('✅ Default badges seeded successfully');
  process.exit();
}

seed().catch(err => { console.error(err); process.exit(1); });