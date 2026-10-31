const express = require('express');
const router = express.Router();
const pickupController = require('../controllers/pickupController');
const { protect } = require('../middleware/auth');

router.post('/:requestId/generate', protect, pickupController.generateTokens);
router.post('/:requestId/verify', protect, pickupController.verifyPickup);
router.post('/:requestId/confirm', protect, pickupController.confirmDelivery);

module.exports = router;
