const Notification = require('../models/Notification');

/**
 * 
 * @param {Object} io 
 * @param {String} recipientId 
 * @param {Object} payload - { sender, request, type, title, message, data }
 */
const sendNotification = async (io, recipientId, payload) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      ...payload
    });

    io.to(`user_${recipientId}`).emit('new_notification', notification);
    return notification;
  } catch (err) {
    console.error('❌ Notification Error:', err.message);
    return null;
  }
};

module.exports = { sendNotification };