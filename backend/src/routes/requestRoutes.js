const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('recipient', 'admin'), requestController.createRequest);
router.get('/my', protect, requestController.getMyRequests);
router.get('/:id', protect, requestController.getRequestById);
router.patch('/:id/accept', protect, authorize('donor', 'admin'), requestController.acceptRequest);
router.patch('/:id/reject', protect, authorize('donor', 'admin'), requestController.rejectRequest);
router.patch('/:id/cancel', protect, authorize('recipient', 'admin'), requestController.cancelRequest);

module.exports = router;
