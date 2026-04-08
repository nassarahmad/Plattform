const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['medical', 'food', 'transport', 'evacuation', 'other'], 
    required: true 
  },
  urgency: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedHelpers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notes: String
}, { timestamps: true });

helpRequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('HelpRequest', helpRequestSchema);