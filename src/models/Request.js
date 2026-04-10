import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 1000 },
  category: { type: String, enum: ['medical', 'food', 'shelter', 'transport', 'other'], required: true, index: true },
  urgency: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium', index: true },
  status: { type: String, enum: ['open', 'accepted', 'in_progress', 'completed', 'cancelled'], default: 'open', index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  assignedHelpers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  location: { type: { type: String, enum: ['Point'], default: 'Point', required: true }, coordinates: { type: [Number], required: true, index: '2dsphere' } },
  images: [{ url: String, publicId: String }],
  lastMessage: { content: String, sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, sentAt: Date }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

requestSchema.index({ location: '2dsphere' });
requestSchema.index({ status: 1, category: 1, createdAt: -1 });
requestSchema.virtual('distance').get(function() { return this._distance ? `${(this._distance / 1000).toFixed(2)} كم` : null; });
requestSchema.virtual('helpersCount').get(function() { return this.assignedHelpers?.length || 0; });
requestSchema.methods.updateStatus = async function(newStatus, io) { this.status = newStatus; await this.save(); if (io && this._id) { io.to(`request:${this._id}`).emit('request:updated', { requestId: this._id, status: newStatus, updatedAt: this.updatedAt }); } return this; };

export default mongoose.model('Request', requestSchema);