const HelpRequest = require('../models/HelpRequest');

exports.createRequest = async (req, res, next) => {
  try {
    const { title, description, category, urgency, location } = req.body;
    const request = await HelpRequest.create({
      title, description, category, urgency,
      location: { type: 'Point', coordinates: location },
      createdBy: req.user._id
    });
    res.status(201).json({ success: true,  request });
  } catch (err) { next(err); }
};

exports.getNearbyRequests = async (req, res, next) => {
  try {
    const { lng, lat, maxDistance = 10000 } = req.query; // maxDistance 
    if (!lng || !lat) return res.status(400).json({ success: false, message: 'longitude and latitude are required' });

    const requests = await HelpRequest.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(maxDistance)
        }
      },
      status: 'pending' 
    }).populate('createdBy', 'name phone').limit(20);

    res.json({ success: true, count: requests.length,  requests });
  } catch (err) { next(err); }
};

exports.acceptRequest = async (req, res, next) => {
  try {
    const request = await HelpRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (request.status !== 'pending') return res.status(400).json({ success: false, message: 'Request is not pending' });

    request.status = 'accepted';
    if (!request.assignedHelpers.includes(req.user._id)) {
      request.assignedHelpers.push(req.user._id);
    }
    await request.save();
    res.json({ success: true, message: 'Request accepted successfully',  request });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });

    const request = await HelpRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true,  request });
  } catch (err) { next(err); }
};