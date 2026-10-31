const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', adminController.getAdminStats);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/verify', adminController.verifyUser);
router.patch('/users/:id/suspend', adminController.suspendUser);
router.get('/listings', adminController.getListings);
router.delete('/listings/:id', adminController.moderateListing);
router.get('/reports', adminController.getReports);
router.patch('/reports/:id/resolve', adminController.resolveReport);

module.exports = router;
