const Request = require('../models/Request');
const Donation = require('../models/Donation');
const User = require('../models/User');
const { generatePickupTokens } = require('../services/pickupService');
const { sendNotification } = require('../services/notificationService');

// POST /api/v1/requests
exports.createRequest = async (req, res) => {
  try {
    const { donationId, requestedQuantity, notes } = req.body;

    if (!donationId || !requestedQuantity || Number(requestedQuantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid donation ID and requested quantity (at least 1).',
      });
    }

    const qty = Number(requestedQuantity);

    // Atomic check and reserve to prevent race conditions & double-booking
    // We increment reservedQuantity only if (reservedQuantity + qty) <= quantity
    const donation = await Donation.findOneAndUpdate(
      {
        _id: donationId,
        status: { $in: ['AVAILABLE', 'PENDING'] },
        $expr: {
          $lte: [{ $add: ['$reservedQuantity', qty] }, '$quantity'],
        },
      },
      {
        $inc: { reservedQuantity: qty },
        $set: { status: 'PENDING' },
      },
      { new: true }
    ).populate('donorId', 'name organizationName email');

    if (!donation) {
      // Find donation to give a helpful explanation
      const existing = await Donation.findById(donationId);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Donation listing does not exist.' });
      }
      const remaining = Math.max(0, existing.quantity - (existing.reservedQuantity || 0));
      return res.status(400).json({
        success: false,
        message: `Requested quantity (${qty}) exceeds remaining available food (${remaining} ${existing.quantityUnit}).`,
      });
    }

    // Create the Request
    const newRequest = await Request.create({
      donationId,
      recipientId: req.user.id,
      requestedQuantity: qty,
      notes: notes || '',
      status: 'PENDING',
      statusHistory: [
        {
          status: 'PENDING',
          timestamp: new Date(),
          updatedBy: req.user.id,
          note: `Request placed by ${req.user.organizationName || req.user.name} for ${qty} ${donation.quantityUnit}.`,
        },
      ],
    });

    // Notify Donor
    await sendNotification({
      recipientUserId: donation.donorId._id,
      title: 'New Food Request Received!',
      message: `${req.user.organizationName || req.user.name} requested ${qty} ${donation.quantityUnit} of ${donation.title}.`,
      type: 'REQUEST_RECEIVED',
      relatedEntityId: newRequest._id,
    });

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully. Waiting for donor confirmation.',
      request: newRequest,
    });
  } catch (error) {
    console.error('[Create Request Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit food request.',
    });
  }
};

// GET /api/v1/requests/my
exports.getMyRequests = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'recipient') {
      filter.recipientId = req.user.id;
    } else if (req.user.role === 'volunteer') {
      filter.$or = [{ volunteerId: req.user.id }, { status: 'ACCEPTED' }];
    } else if (req.user.role === 'donor') {
      // Donors see requests for their donations
      const myDonations = await Donation.find({ donorId: req.user.id }).select('_id');
      const donationIds = myDonations.map((d) => d._id);
      filter.donationId = { $in: donationIds };
    }

    const requests = await Request.find(filter)
      .populate('donationId')
      .populate('recipientId', 'name organizationName phone email isVerified address location')
      .populate('volunteerId', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error('[Get My Requests Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve food requests.',
    });
  }
};

// GET /api/v1/requests/:id
exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate({
        path: 'donationId',
        populate: { path: 'donorId', select: 'name organizationName phone address location rating' },
      })
      .populate('recipientId', 'name organizationName phone email isVerified address location')
      .populate('volunteerId', 'name phone');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch request details.',
    });
  }
};

// PATCH /api/v1/requests/:id/accept
exports.acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('donationId');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    const donation = request.donationId;
    if (donation.donorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized. Only the food donor can accept this request.' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: `Cannot accept a request with status '${request.status}'.` });
    }

    // Generate secure pickup OTP & QR Code payload
    const { rawOtp, otpHash, otpExpiresAt, qrPayload } = await generatePickupTokens(
      request._id,
      donation._id,
      request.recipientId
    );

    request.status = 'ACCEPTED';
    request.pickupOtpHash = otpHash;
    request.rawOtp = rawOtp;
    request.otpExpiresAt = otpExpiresAt;
    request.qrPayload = qrPayload;
    request.statusHistory.push({
      status: 'ACCEPTED',
      timestamp: new Date(),
      updatedBy: req.user.id,
      note: `Request accepted by donor ${req.user.organizationName || req.user.name}. OTP & QR code issued for verification.`,
    });

    await request.save();

    // Check if donation is now fully reserved
    if (donation.reservedQuantity >= donation.quantity) {
      donation.status = 'ACCEPTED';
      await donation.save();
    }

    // Notify Recipient NGO
    await sendNotification({
      recipientUserId: request.recipientId,
      title: 'Food Request Accepted!',
      message: `Your request for ${donation.title} has been accepted! Access your QR code & pickup OTP to claim.`,
      type: 'REQUEST_ACCEPTED',
      relatedEntityId: request._id,
    });

    res.status(200).json({
      success: true,
      message: 'Request accepted. Pickup OTP & QR code generated.',
      request,
    });
  } catch (error) {
    console.error('[Accept Request Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to accept request.',
    });
  }
};

// PATCH /api/v1/requests/:id/reject
exports.rejectRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    const request = await Request.findById(req.params.id).populate('donationId');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    const donation = request.donationId;
    if (donation.donorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized. Only donor can reject this request.' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: `Cannot reject a request in '${request.status}' state.` });
    }

    // Release reserved quantity atomically
    await Donation.findByIdAndUpdate(donation._id, {
      $inc: { reservedQuantity: -request.requestedQuantity },
      $set: { status: 'AVAILABLE' },
    });

    request.status = 'REJECTED';
    request.statusHistory.push({
      status: 'REJECTED',
      timestamp: new Date(),
      updatedBy: req.user.id,
      note: reason || 'Declined by donor due to schedule or capacity.',
    });

    await request.save();

    // Notify Recipient NGO
    await sendNotification({
      recipientUserId: request.recipientId,
      title: 'Food Request Declined',
      message: `Your request for ${donation.title} was declined: ${reason || 'Donor capacity reached.'}`,
      type: 'REQUEST_REJECTED',
      relatedEntityId: request._id,
    });

    res.status(200).json({
      success: true,
      message: 'Request rejected and inventory released.',
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject request.',
    });
  }
};

// PATCH /api/v1/requests/:id/cancel
exports.cancelRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('donationId');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    // Only recipient can cancel
    if (request.recipientId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized. Only the recipient can cancel their request.' });
    }

    if (['COMPLETED', 'PICKUP_IN_PROGRESS', 'CANCELLED', 'REJECTED'].includes(request.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a request with status '${request.status}'.`,
      });
    }

    // Release reserved quantity
    await Donation.findByIdAndUpdate(request.donationId._id, {
      $inc: { reservedQuantity: -request.requestedQuantity },
      $set: { status: 'AVAILABLE' },
    });

    request.status = 'CANCELLED';
    request.statusHistory.push({
      status: 'CANCELLED',
      timestamp: new Date(),
      updatedBy: req.user.id,
      note: 'Cancelled by recipient NGO.',
    });

    await request.save();

    // Notify Donor
    await sendNotification({
      recipientUserId: request.donationId.donorId,
      title: 'Food Request Cancelled',
      message: `${req.user.organizationName || req.user.name} cancelled their request. Inventory has been restored.`,
      type: 'REQUEST_CANCELLED',
      relatedEntityId: request._id,
    });

    res.status(200).json({
      success: true,
      message: 'Request cancelled and inventory restored to available surplus.',
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel request.',
    });
  }
};
