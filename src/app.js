require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { initSocket } = require('./socket');
const { helmetConfig, corsConfig, globalLimiter, authLimiter, sanitizeData }
 =require('./middleware/security');

const app = express();
const server = http.createServer(app);
// 1️⃣ Security Headers & CORS
app.use(helmetConfig);
app.use(corsConfig);

// 2️⃣ Global Rate Limit
app.use(globalLimiter);
// 3️⃣ Data Sanitization
app.use(sanitizeData);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'))
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/badges', require('./routes/badgeRoutes'));
// Error Handler
app.use(require('./middleware/errorMiddleware'));
const io = initSocket(server);
app.set('io', io);

// Database & Server
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ DB Error:', err.message);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 3000;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();
module.exports = { app, io, server };