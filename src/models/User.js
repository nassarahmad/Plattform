import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['help_seeker', 'helper', 'organization', 'admin'], default: 'help_seeker', index: true },
  permissions: { type: [String], default: [] },
  isVerified: { type: Boolean, default: false, index: true },
  avatar: { type: String, default: null },
  phone: { type: String, trim: true },
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' }
  },
  lastSeen: { type: Date, default: Date.now },
  isOnline: { type: Boolean, default: false, index: true },
  stats: { requestsCreated: { type: Number, default: 0 }, requestsHelped: { type: Number, default: 0 }, rating: { type: Number, default: 0, min: 0, max: 5 } }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.pre('save', async function(next) { if (!this.isModified('password')) return next(); this.password = await bcrypt.hash(this.password, 12); next(); });
userSchema.methods.comparePassword = async function(candidatePassword) { return await bcrypt.compare(candidatePassword, this.password); };
userSchema.virtual('profile').get(function() { return { id: this._id, name: this.name, email: this.email, role: this.role, permissions: this.permissions, avatar: this.avatar, isVerified: this.isVerified, isOnline: this.isOnline, stats: this.stats }; });
userSchema.methods.updateLocation = function(lat, lng) { this.currentLocation = { type: 'Point', coordinates: [lng, lat] }; this.lastSeen = Date.now(); return this.save(); };

export default mongoose.model('User', userSchema);