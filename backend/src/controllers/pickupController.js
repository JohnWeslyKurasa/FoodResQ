const Request = require('../models/Request');
const Donation = require('../models/Donation');
const DonationHistory = require('../models/DonationHistory');
const { generatePickupTokens, verifyOtp } = require('../services/pickupService');
const { sendNotification } = require('../services/notificationService');

// POST /api/v1/pickup/:requestId/generate
exports.generateTokens = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId).populate('donationId');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'ACCEPTED' && request.status !== 'PICKUP_IN_PROGRESS') {
      return res.status(400).json({
        success: false,
        message: 'Tokens can only be generated for accepted food requests.',
      });
    }

    // Only authorized recipient or donor or admin
    if (
      request.recipientId.toString() !== req.user.id &&
      request.donationId.donorId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized to generate tokens for this request.' });
    }

    const { rawOtp, otpHash, otpExpiresAt, qrPayload } = await generatePickupTokens(
      request._id,
      request.donationId._id,
      request.recipientId
    );

    request.pickupOtpHash = otpHash;
    request.rawOtp = rawOtp;
    request.otpExpiresAt = otpExpiresAt;
    request.qrPayload = qrPayload;
    await request.save();

    res.status(200).json({
      success: true,
      message: 'New pickup verification tokens generated.',
      qrPayload,
      rawOtp,
      otpExpiresAt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate pickup tokens.',
    });
  }
};

// POST /api/v1/pickup/:requestId/verify
exports.verifyPickup = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the 6-digit pickup OTP to verify.',
      });
    }

    const request = await Request.findById(req.params.requestId).populate('donationId');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (request.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'This food rescue pickup has already been verified and completed.',
      });
    }

    if (!request.pickupOtpHash) {
      return res.status(400).json({
        success: false,
        message: 'No active pickup OTP found for this request. Please ask recipient to generate token.',
      });
    }

    const verification = await verifyOtp(
      otp,
      request.pickupOtpHash,
      request.otpExpiresAt,
      request.isOtpVerified
    );

    if (!verification.success) {
      return res.status(400).json({
        success: false,
        message: verification.message,
      });
    }

    // Mark as verified & transition to in-progress or ready to confirm
    request.isOtpVerified = true;
    request.status = 'PICKUP_IN_PROGRESS';
    request.statusHistory.push({
      status: 'PICKUP_IN_PROGRESS',
      timestamp: new Date(),
      updatedBy: req.user.id,
      note: `OTP verified by ${req.user.name} (${req.user.role}). Food is in transit.`,
    });

    if (req.user.role === 'volunteer' && !request.volunteerId) {
      request.volunteerId = req.user.id;
    }

    await request.save();

    // Notify recipient
    await sendNotification({
      recipientUserId: request.recipientId,
      title: 'Pickup Verified!',
      message: `Your food pickup was verified by ${req.user.name}. Delivery is underway.`,
      type: 'PICKUP_VERIFIED',
      relatedEntityId: request._id,
    });

    res.status(200).json({
      success: true,
      message: 'Pickup OTP verified successfully. Handover in progress.',
      request,
    });
  } catch (error) {
    console.error('[Verify Pickup Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying pickup.',
    });
  }
};

// POST /api/v1/pickup/:requestId/confirm
exports.confirmDelivery = async (req, res) => {
  try {
    const { donorRating, recipientRating, notes } = req.body;

    const request = await Request.findById(req.params.requestId).populate('donationId');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (request.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'This rescue order has already been marked completed.',
      });
    }

    const donation = request.donationId;
    const now = new Date();

    request.status = 'COMPLETED';
    request.completedAt = now;
    request.statusHistory.push({
      status: 'COMPLETED',
      timestamp: now,
      updatedBy: req.user.id,
      note: notes || `Food delivery confirmed and completed by ${req.user.name}.`,
    });

    await request.save();

    // Check if donation is completely redistributed
    if (donation.reservedQuantity >= donation.quantity) {
      donation.status = 'COMPLETED';
      await donation.save();
    }

    // Create DonationHistory record for verified impact calculations
    const historyEntry = await DonationHistory.create({
      donationId: donation._id,
      requestId: request._id,
      donorId: donation.donorId,
      recipientId: request.recipientId,
      volunteerId: request.volunteerId || (req.user.role === 'volunteer' ? req.user.id : null),
      verifiedQuantity: request.requestedQuantity,
      quantityUnit: donation.quantityUnit,
      completedAt: now,
      donorRating: donorRating ? Number(donorRating) : 5,
      recipientRating: recipientRating ? Number(recipientRating) : 5,
      notes: notes || 'Successfully redistributed to community members.',
    });

    // Notify Donor
    await sendNotification({
      recipientUserId: donation.donorId,
      title: 'Donation Completed & Verified!',
      message: `${request.requestedQuantity} ${donation.quantityUnit} of ${donation.title} reached people in need. Thank you for making an impact!`,
      type: 'DONATION_COMPLETED',
      relatedEntityId: historyEntry._id,
    });

    // Notify Recipient NGO
    await sendNotification({
      recipientUserId: request.recipientId,
      title: 'Meals Successfully Received!',
      message: `Donation completion recorded. Thank you for feeding the community.`,
      type: 'DONATION_COMPLETED',
      relatedEntityId: historyEntry._id,
    });

    res.status(200).json({
      success: true,
      message: 'Food rescue completed! Live impact database updated.',
      request,
      historyEntry,
    });
  } catch (error) {
    console.error('[Confirm Delivery Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to confirm delivery.',
    });
  }
};
