const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Middleware to ensure user is authenticated and has delivery role
router.use(auth, checkRole(['delivery']));

// Get assigned deliveries
router.get('/assigned', deliveryController.getAssignedDeliveries);

// Start delivery
router.post('/start', deliveryController.startDelivery);

// Complete delivery
router.post('/complete', deliveryController.completeDelivery);

// Get delivery history
router.get('/history', deliveryController.getDeliveryHistory);

module.exports = router; 