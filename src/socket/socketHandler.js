import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Request from '../models/Request.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    socket.on('auth', async (token, callback) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        await User.findByIdAndUpdate(socket.userId, { isOnline: true, lastSeen: Date.now() });
        socket.broadcast.emit('user:status_changed', { userId: socket.userId, isOnline: true });
        callback?.({ success: true });
      } catch { callback?.({ success: false, message: 'توكن غير صالح' }); socket.disconnect(); }
    });

    socket.on('request:join', (requestId, callback) => {
      if (!socket.userId) return callback?.({ success: false });
      socket.join(`request:${requestId}`);
      callback?.({ success: true, room: `request:${requestId}` });
    });

    socket.on('request:leave', (requestId, callback) => { socket.leave(`request:${requestId}`); callback?.({ success: true }); });

    socket.on('message:send', async ({ requestId, content }, callback) => {
      if (!socket.userId || !requestId || !content) return callback?.({ success: false });
      io.to(`request:${requestId}`).emit('message:received', { id: Date.now().toString(), content, sender: socket.userId, timestamp: new Date() });
      await Request.findByIdAndUpdate(requestId, { lastMessage: { content: content.substring(0, 100), sentBy: socket.userId, sentAt: new Date() } });
      callback?.({ success: true });
    });

    socket.on('location:share', ({ requestId, lat, lng }) => {
      if (!socket.userId || !requestId) return;
      socket.to(`request:${requestId}`).emit('location:updated', { userId: socket.userId, location: { type: 'Point', coordinates: [lng, lat] }, timestamp: Date.now() });
    });

    socket.on('user:update_status', async ({ isOnline }) => {
      if (!socket.userId) return;
      await User.findByIdAndUpdate(socket.userId, { isOnline, lastSeen: isOnline ? Date.now() : undefined });
      socket.broadcast.emit('user:status_changed', { userId: socket.userId, isOnline });
    });

    socket.on('disconnect', async () => {
      if (socket.userId) { await User.findByIdAndUpdate(socket.userId, { isOnline: false, lastSeen: Date.now() }); socket.broadcast.emit('user:status_changed', { userId: socket.userId, isOnline: false }); }
    });
  });
};