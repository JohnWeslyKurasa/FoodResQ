const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      'REQUEST_RECEIVED',
      'REQUEST_ACCEPTED',
      'REQUEST_REJECTED',
      'REQUEST_CANCELLED',
      'PICKUP_READY',
      'PICKUP_VERIFIED',
      'DONATION_COMPLETED',
      'GENERAL'
    ],
    default: 'GENERAL',
  },
  relatedEntityId: {
    type: String,
    default: null,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

notificationSchema.index({ recipientUserId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
