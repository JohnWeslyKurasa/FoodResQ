const User = require('../models/User');
const Donation = require('../models/Donation');
const Request = require('../models/Request');
const DonationHistory = require('../models/DonationHistory');
const Report = require('../models/Report');

// GET /api/v1/admin/stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalNgos = await User.countDocuments({ role: 'recipient' });
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const totalDonations = await Donation.countDocuments();
    const activeListings = await Donation.countDocuments({ status: { $in: ['AVAILABLE', 'PENDING'] } });
    const pendingRequests = await Request.countDocuments({ status: 'PENDING' });
    const completedDonations = await DonationHistory.countDocuments();
    const reportsCount = await Report.countDocuments({ status: 'PENDING' });

    const completed = await DonationHistory.find().select('verifiedQuantity');
    const totalMeals = completed.reduce((acc, c) => acc + (c.verifiedQuantity || 0), 0);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalDonors,
        totalNgos,
        totalVolunteers,
        totalDonations,
        activeListings,
        pendingRequests,
        completedDonations,
        totalMealsRedistributed: totalMeals,
        pendingReports: reportsCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve admin stats.' });
  }
};

// GET /api/v1/admin/users
exports.getUsers = async (req, res) => {
  try {
    const { role, isVerified, search } = req.query;
    const filter = {};
    if (role && role !== 'All') filter.role = role;
    if (isVerified !== undefined && isVerified !== '') filter.isVerified = isVerified === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { organizationName: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
};

// PATCH /api/v1/admin/users/:id/verify
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : !user.isVerified;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Organization ${user.organizationName || user.name} is now ${user.isVerified ? 'VERIFIED' : 'UNVERIFIED'}.`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/v1/admin/users/:id/suspend
exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot suspend an administrative account.' });
    }

    user.isSuspended = req.body.isSuspended !== undefined ? req.body.isSuspended : !user.isSuspended;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isSuspended ? 'SUSPENDED' : 'ACTIVATED'}.`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/admin/listings
exports.getListings = async (req, res) => {
  try {
    const listings = await Donation.find()
      .populate('donorId', 'name organizationName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: listings.length, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch listings.' });
  }
};

// DELETE /api/v1/admin/listings/:id
exports.moderateListing = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    donation.status = 'CANCELLED';
    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Donation listing removed by administrator moderation.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/admin/reports
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reportedBy', 'name email organizationName')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reports.' });
  }
};

// PATCH /api/v1/admin/reports/:id/resolve
exports.resolveReport = async (req, res) => {
  try {
    const { status = 'RESOLVED', adminResolutionNote } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    report.status = status;
    report.adminResolutionNote = adminResolutionNote || 'Reviewed and addressed by administration.';
    report.resolvedAt = new Date();
    report.resolvedBy = req.user.id;
    await report.save();

    res.status(200).json({
      success: true,
      message: `Report marked as ${status}.`,
      report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
