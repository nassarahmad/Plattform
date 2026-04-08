const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
role: { 
    type: String, 
    enum: ['help_seeker', 'helper', 'organization', 'admin'], 
    default: 'help_seeker' 
  },  permissions: { type: [String], default: [] } ,
    phone: String,
isVerified: { type: Boolean, default: false },
averageRating: { type: Number, default: 0, min: 0, max: 5 },
reviewCount: { type: Number, default: 0 },
badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
xp: { type: Number, default: 0 },
level: { type: Number, default: 1 },
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return ;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidate) {
  return await bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);