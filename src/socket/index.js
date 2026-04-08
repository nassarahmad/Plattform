const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL || '*', methods: ['GET', 'POST'] }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) return next(new Error('unauthorized'));
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { id: decoded.id, role: decoded.role }; 
      next();
    } catch (err) {
      next(new Error('توكن غير صالح'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.user.id}`);

    socket.on('join_request', (requestId) => {
      socket.join(`req_${requestId}`);
      console.log(`👤 ${socket.user.id} joined room req_${requestId}`);
    });

    socket.on('send_message', async ({ requestId, content }) => {
      try {
        const msg = await Message.create({
          request: requestId,
          sender: socket.user.id,
          type: 'text',
          content
        });
        io.to(`req_${requestId}`).emit('new_message', msg);
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('share_location', async ({ requestId, lat, lng }) => {
      try {
        const msg = await Message.create({
          request: requestId,
          sender: socket.user.id,
          type: 'location',
          content: JSON.stringify({ lat, lng })
        });
        io.to(`req_${requestId}`).emit('new_message', msg);
      } catch (err) {
        socket.emit('error', { message: 'Failed to share location' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.id}`);
    });
  });

  return io;
};

module.exports = { initSocket };