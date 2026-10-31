const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/auth');

router.get('/nearby', donationController.getNearbyDonations);
router.get('/my', protect, authorize('donor', 'admin'), donationController.getMyDonations);
router.get('/', donationController.getAllDonations);
router.post('/', protect, authorize('donor', 'admin'), donationController.createDonation);
router.get('/:id', donationController.getDonationById);
router.patch('/:id', protect, authorize('donor', 'admin'), donationController.updateDonation);
router.delete('/:id', protect, authorize('donor', 'admin'), donationController.deleteDonation);

module.exports = router;
