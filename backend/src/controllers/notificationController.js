const Notification = require('../models/Notification');
const Report = require('../models/Report');

// GET /api/v1/notifications
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientUserId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipientUserId: req.user.id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/v1/notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientUserId: req.user.id },
      { isRead: true },
      { new: true }
    );
    res.status(200).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/v1/notifications/read-all
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipientUserId: req.user.id }, { isRead: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/v1/reports
exports.createReport = async (req, res) => {
  try {
    const { targetType, targetId, reason, details } = req.body;
    if (!targetType || !targetId || !reason) {
      return res.status(400).json({ success: false, message: 'Missing report target or reason.' });
    }

    const report = await Report.create({
      reportedBy: req.user.id,
      targetType,
      targetId,
      reason,
      details: details || '',
      status: 'PENDING',
    });

    res.status(201).json({
      success: true,
      message: 'Safety or dispute report submitted to FoodResQ trust & safety team.',
      report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
