const jwt = require('jsonwebtoken');
const User = require('../models/User');
const HelpRequest = require('../models/HelpRequest');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return res.status(401).json({ success: false, message: 'not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'the user already exists' });
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'token is invalid or expired' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `the role ${req.user.role} is not authorized` });
    }
    next();
  };
};

const permit = (...permissions) => {
  return (req, res, next) => {
    const hasPermission = permissions.some(p => req.user.permissions.includes(p));
    if (!hasPermission && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'not enough permissions' });
    }
    next();
  };
};

const isResourceOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id && req.originalUrl.includes('/requests/')) {
      const request = await HelpRequest.findById(id);
      if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
      
      const isOwner = request.createdBy.toString() === req.user._id.toString();
      const isAssigned = request.assignedHelpers.some(h => h.toString() === req.user._id.toString());
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAssigned && !isAdmin) {
        return res.status(403).json({ success: false, message: 'You are not the owner of this resource' });
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { protect, authorize, permit, isResourceOwner };