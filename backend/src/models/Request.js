const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  donationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  requestedQuantity: {
    type: Number,
    required: [true, 'Requested quantity is required'],
    min: [1, 'Must request at least 1 unit'],
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'PICKUP_IN_PROGRESS', 'COMPLETED'],
    default: 'PENDING',
  },
  notes: {
    type: String,
    default: '',
  },
  statusHistory: [
    {
      status: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      note: { type: String, default: '' },
    }
  ],
  pickupOtpHash: {
    type: String,
    default: null,
  },
  rawOtp: {
    type: String, // Stored temporarily or returned to authorized recipient
    default: null,
  },
  otpExpiresAt: {
    type: Date,
    default: null,
  },
  isOtpVerified: {
    type: Boolean,
    default: false,
  },
  qrPayload: {
    type: String,
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

requestSchema.index({ donationId: 1, recipientId: 1, status: 1 });

module.exports = mongoose.models.Request || mongoose.model('Request', requestSchema);
