const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.get('/donor', protect, authorize('donor', 'admin'), dashboardController.getDonorDashboard);
router.get('/recipient', protect, authorize('recipient', 'admin'), dashboardController.getRecipientDashboard);
router.get('/volunteer', protect, authorize('volunteer', 'admin'), dashboardController.getVolunteerDashboard);
router.get('/impact', dashboardController.getImpactAnalytics);
router.get('/organizations', dashboardController.getPublicOrganizations);

module.exports = router;
