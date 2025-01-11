const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantryController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Middleware to ensure user is authenticated and has pantry role
router.use(auth, checkRole(['pantry']));

// Get all assigned meal tasks
router.get('/tasks', pantryController.getAssignedTasks);

// Update meal preparation status
router.put('/meal-status', pantryController.updateMealStatus);

// Get all delivery personnel
router.get('/delivery-personnel', pantryController.getDeliveryPersonnel);

// Assign meal to delivery person
router.post('/assign-delivery', pantryController.assignDeliveryPerson);

// Get meal delivery tracking
router.get('/delivery-tracking', pantryController.getDeliveryTracking);

module.exports = router; 