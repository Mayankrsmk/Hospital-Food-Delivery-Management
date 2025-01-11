const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Middleware to ensure user is authenticated and has manager role
router.use(auth, checkRole(['manager']));

// Get dashboard statistics
router.get('/stats', managerController.getDashboardStats);

// Get all deliveries with optional filters
router.get('/deliveries', managerController.getAllDeliveries);

// Get pantry performance metrics
router.get('/pantry-metrics', managerController.getPantryMetrics);

// Get alerts for delayed deliveries and issues
router.get('/alerts', managerController.getAlerts);

module.exports = router; 