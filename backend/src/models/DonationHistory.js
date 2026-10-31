const mongoose = require('mongoose');

const donationHistorySchema = new mongoose.Schema({
  donationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: true,
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true,
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  verifiedQuantity: {
    type: Number,
    required: true,
  },
  quantityUnit: {
    type: String,
    default: 'meals',
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
  donorRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  recipientRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  notes: {
    type: String,
    default: 'Successfully verified and delivered.',
  },
}, {
  timestamps: true,
});

donationHistorySchema.index({ donorId: 1, recipientId: 1, completedAt: -1 });

module.exports = mongoose.models.DonationHistory || mongoose.model('DonationHistory', donationHistorySchema);
