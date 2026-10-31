const Notification = require('../models/Notification');

let ioInstance = null;

function setSocketIO(io) {
  ioInstance = io;
}

/**
 * Send real-time and persisted notification to a user
 */
async function sendNotification({ recipientUserId, title, message, type = 'GENERAL', relatedEntityId = null }) {
  try {
    // 1. Persist notification in MongoDB
    const notification = await Notification.create({
      recipientUserId,
      title,
      message,
      type,
      relatedEntityId: relatedEntityId ? String(relatedEntityId) : null,
      isRead: false,
    });

    // 2. Emit real-time message via Socket.IO if connected
    if (ioInstance) {
      ioInstance.to(`user_${recipientUserId.toString()}`).emit('notification', notification);
      ioInstance.emit('broadcast_activity', {
        title,
        type,
        timestamp: new Date(),
      });
    }

    return notification;
  } catch (error) {
    console.error('[NotificationService Error]:', error.message);
    return null;
  }
}

module.exports = {
  setSocketIO,
  sendNotification,
};
