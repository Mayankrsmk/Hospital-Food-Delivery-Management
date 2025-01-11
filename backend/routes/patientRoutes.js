const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// All routes require authentication
router.use(auth);

// Routes accessible by manager and pantry roles
router.get('/', checkRole(['manager', 'pantry']), patientController.getAllPatients);
router.get('/:id', checkRole(['manager', 'pantry']), patientController.getPatientById);

// Routes accessible only by manager role
router.post('/', checkRole(['manager']), patientController.createPatient);
router.put('/:id', checkRole(['manager']), patientController.updatePatient);
router.delete('/:id', checkRole(['manager']), patientController.deletePatient);

module.exports = router; 