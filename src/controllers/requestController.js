import Request from '../models/Request.js';
import catchAsync from '../utils/catchAsync.js';

export const getNearbyRequests = catchAsync(async (req, res) => {
  const { lat, lng, radius = 5000, category, urgency } = req.query;
  if (!lat || !lng) return res.status(400).json({ success: false, message: 'يرجى إرسال الموقع' });
  const query = { status: 'open', location: { $geoWithin: { $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius / 6378100] } } };
  if (category) query.category = category;
  if (urgency) query.urgency = urgency;
  if (req.user._id) query.createdBy = { $ne: req.user._id };
  const requests = await Request.find(query).select('title description category urgency status location createdBy assignedHelpers createdAt').populate('createdBy', 'name avatar role').populate('assignedHelpers', 'name avatar role').near({ center: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }, maxDistance: radius, distanceField: '_distance', spherical: true }).sort({ urgency: -1, createdAt: -1 }).limit(50);
  res.status(200).json({ success: true, count: requests.length, data: requests.map(r => ({ ...r.toObject(), distance: r._distance })), meta: { userLocation: [parseFloat(lng), parseFloat(lat)], radius } });
});

export const createRequest = catchAsync(async (req, res) => {
  const { title, description, category, urgency, location, images } = req.body;
  if (!location?.coordinates || location.type !== 'Point') return res.status(400).json({ success: false, message: 'صيغة الموقع غير صحيحة' });
  const request = await Request.create({ title, description, category, urgency: urgency || 'medium', location, createdBy: req.user._id, images: images || [] });
  await req.user.updateOne({ $inc: { 'stats.requestsCreated': 1 } });
  if (req.io) req.io.emit('request:created', { requestId: request._id, location: request.location, category, urgency: request.urgency, createdBy: req.user.profile });
  res.status(201).json({ success: true, message: 'تم إنشاء الطلب', data: request });
});

export const acceptRequest = catchAsync(async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
  if (request.createdBy.toString() === req.user._id.toString()) return res.status(400).json({ success: false, message: 'لا يمكنك قبول طلبك' });
  if (request.status !== 'open') return res.status(400).json({ success: false, message: `حالة الطلب الحالية: ${request.status}` });
  if (!request.assignedHelpers.includes(req.user._id)) request.assignedHelpers.push(req.user._id);
  request.status = 'accepted';
  await request.save();
  if (req.io) req.io.to(`request:${request._id}`).emit('request:accepted', { requestId: request._id, helper: req.user.profile, acceptedAt: new Date() });
  res.status(200).json({ success: true, message: 'تم قبول الطلب', data: request });
});