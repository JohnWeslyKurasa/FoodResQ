const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetType: {
    type: String,
    enum: ['DONATION', 'USER', 'REQUEST'],
    required: true,
  },
  targetId: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'],
    default: 'PENDING',
  },
  adminResolutionNote: {
    type: String,
    default: '',
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.models.Report || mongoose.model('Report', reportSchema);
