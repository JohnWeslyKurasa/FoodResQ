const Donation = require('../models/Donation');
const Request = require('../models/Request');
const User = require('../models/User');
const { calculateMatchScore, calculateDistanceKm } = require('../services/matchingEngine');
const { sendNotification } = require('../services/notificationService');

// POST /api/v1/donations
exports.createDonation = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      quantity,
      quantityUnit = 'meals',
      imageUrl,
      preparationTime,
      pickupStartTime,
      pickupEndTime,
      useByDate,
      storageConditions,
      handlingInstructions,
      allergenInfo,
      pickupAddress,
      latitude,
      longitude,
    } = req.body;

    if (!title || !description || !category || !quantity || !pickupStartTime || !pickupEndTime || !pickupAddress) {
      return res.status(400).json({
        success: false,
        message: 'Missing required donation fields. Please provide title, description, category, quantity, pickup times, and address.',
      });
    }

    const start = new Date(pickupStartTime);
    const end = new Date(pickupEndTime);
    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'Pickup end time must be later than pickup start time.',
      });
    }

    const now = new Date();
    const hoursRemaining = (end - now) / (1000 * 60 * 60);
    let urgency = 'normal';
    if (hoursRemaining < 3) urgency = 'critical';
    else if (hoursRemaining < 6) urgency = 'urgent';

    // Coordinates fallback to user's registered location if not specified
    let coordinates = [78.3826, 17.4483];
    if (longitude !== undefined && latitude !== undefined && !isNaN(longitude) && !isNaN(latitude)) {
      coordinates = [parseFloat(longitude), parseFloat(latitude)];
    } else if (req.user.location?.coordinates) {
      coordinates = req.user.location.coordinates;
    }

    const donation = await Donation.create({
      title,
      description,
      category,
      quantity: Number(quantity),
      quantityUnit,
      reservedQuantity: 0,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      preparationTime: preparationTime ? new Date(preparationTime) : new Date(Date.now() - 3600000),
      pickupStartTime: start,
      pickupEndTime: end,
      useByDate: useByDate ? new Date(useByDate) : new Date(end.getTime() + 6 * 3600000),
      storageConditions: storageConditions || 'Room Temperature (15-25°C)',
      handlingInstructions: handlingInstructions || 'Keep covered in food-safe containers. Transport promptly.',
      allergenInfo: Array.isArray(allergenInfo) ? allergenInfo : (allergenInfo ? [allergenInfo] : ['None reported']),
      pickupAddress,
      location: {
        type: 'Point',
        coordinates,
      },
      donorId: req.user.id,
      status: 'AVAILABLE',
      urgency,
    });

    // Notify registered NGOs nearby
    const nearbyNgos = await User.find({ role: 'recipient', isSuspended: false }).limit(5);
    for (const ngo of nearbyNgos) {
      sendNotification({
        recipientUserId: ngo._id,
        title: 'New Surplus Food Available!',
        message: `${req.user.organizationName || 'A donor'} listed ${quantity} ${quantityUnit} of ${title} (${category}).`,
        type: 'GENERAL',
        relatedEntityId: donation._id,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Food donation listed successfully and broadcasted to local NGOs.',
      donation,
    });
  } catch (error) {
    console.error('[Create Donation Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to list food donation.',
    });
  }
};

// GET /api/v1/donations
exports.getAllDonations = async (req, res) => {
  try {
    const { category, status, urgency, search, sort } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    } else {
      filter.status = { $in: ['AVAILABLE', 'PENDING'] };
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (urgency && urgency !== 'All') {
      filter.urgency = urgency;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { pickupAddress: { $regex: search, $options: 'i' } },
      ];
    }

    let query = Donation.find(filter).populate('donorId', 'name organizationName organizationType rating isVerified location phone');

    // Default newest first
    query = query.sort({ createdAt: -1 });

    const donations = await query.exec();

    // If logged in as NGO, calculate recommendation scores & distance
    let userCoords = [78.3826, 17.4483];
    if (req.user && req.user.location?.coordinates) {
      userCoords = req.user.location.coordinates;
    }

    let results = donations.map((d) => {
      const obj = d.toObject();
      const dCoords = obj.location?.coordinates || [78.3826, 17.4483];
      obj.distanceKm = calculateDistanceKm(dCoords[1], dCoords[0], userCoords[1], userCoords[0]);
      obj.remainingQuantity = Math.max(0, obj.quantity - (obj.reservedQuantity || 0));

      if (req.user && req.user.role === 'recipient') {
        const matchResult = calculateMatchScore(obj, req.user);
        if (matchResult) {
          obj.matchScore = matchResult.score;
          obj.matchReasons = matchResult.reasons;
          obj.matchSummary = matchResult.summary;
          obj.matchBreakdown = matchResult.breakdown;
        } else {
          obj.matchScore = 50;
          obj.matchSummary = `${obj.distanceKm} km away`;
        }
      } else {
        obj.matchScore = Math.max(60, Math.round(95 - obj.distanceKm * 2));
      }
      return obj;
    });

    // Custom sorting if requested
    if (sort === 'nearest') {
      results.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sort === 'match') {
      results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sort === 'urgent') {
      const urgencyRank = { critical: 3, urgent: 2, normal: 1 };
      results.sort((a, b) => (urgencyRank[b.urgency] || 0) - (urgencyRank[a.urgency] || 0));
    } else if (sort === 'quantity') {
      results.sort((a, b) => b.remainingQuantity - a.remainingQuantity);
    }

    res.status(200).json({
      success: true,
      count: results.length,
      donations: results,
    });
  } catch (error) {
    console.error('[Get All Donations Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve food listings.',
    });
  }
};

// GET /api/v1/donations/:id
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate(
      'donorId',
      'name email phone organizationName organizationType rating isVerified location address'
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation listing not found.',
      });
    }

    const obj = donation.toObject();
    obj.remainingQuantity = Math.max(0, obj.quantity - (obj.reservedQuantity || 0));

    if (req.user) {
      const userCoords = req.user.location?.coordinates || [78.3826, 17.4483];
      const dCoords = obj.location?.coordinates || [78.3826, 17.4483];
      obj.distanceKm = calculateDistanceKm(dCoords[1], dCoords[0], userCoords[1], userCoords[0]);

      if (req.user.role === 'recipient') {
        const match = calculateMatchScore(obj, req.user);
        if (match) {
          obj.matchScore = match.score;
          obj.matchReasons = match.reasons;
          obj.matchSummary = match.summary;
          obj.matchBreakdown = match.breakdown;
        }
      }
    }

    res.status(200).json({
      success: true,
      donation: obj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donation details.',
    });
  }
};

// GET /api/v1/donations/my
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user.id }).sort({ createdAt: -1 });
    
    // Attach request counts to each donation
    const donationIds = donations.map((d) => d._id);
    const requests = await Request.find({ donationId: { $in: donationIds } })
      .populate('recipientId', 'name organizationName phone isVerified')
      .sort({ createdAt: -1 });

    const donationsWithRequests = donations.map((d) => {
      const doc = d.toObject();
      doc.remainingQuantity = Math.max(0, doc.quantity - (doc.reservedQuantity || 0));
      doc.requests = requests.filter((r) => r.donationId.toString() === d._id.toString());
      doc.pendingRequestsCount = doc.requests.filter((r) => r.status === 'PENDING').length;
      return doc;
    });

    res.status(200).json({
      success: true,
      count: donationsWithRequests.length,
      donations: donationsWithRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve donor listings.',
    });
  }
};

// PATCH /api/v1/donations/:id
exports.updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    // Only donor owner or admin can update
    if (donation.donorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this donation.' });
    }

    const updated = await Donation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Donation updated successfully.',
      donation: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update donation.',
    });
  }
};

// DELETE /api/v1/donations/:id
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found.' });
    }

    if (donation.donorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this donation.' });
    }

    donation.status = 'CANCELLED';
    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Donation listing cancelled successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete donation.',
    });
  }
};

// GET /api/v1/donations/nearby
exports.getNearbyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      status: { $in: ['AVAILABLE', 'PENDING'] },
    }).populate('donorId', 'name organizationName phone isVerified rating');

    res.status(200).json({
      success: true,
      donations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve map markers.',
    });
  }
};
