const Patient = require('../models/Patient');

const patientController = {
  // Create new patient
  async createPatient(req, res) {
    try {
      const patient = new Patient(req.body);
      await patient.save();
      res.status(201).json(patient);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all patients
  async getAllPatients(req, res) {
    try {
      const { status, search } = req.query;
      const query = {};

      if (status) {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { 'contactInformation.phone': { $regex: search, $options: 'i' } }
        ];
      }

      const patients = await Patient.find(query).sort({ admissionDate: -1 });
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get patient by ID
  async getPatientById(req, res) {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update patient
  async updatePatient(req, res) {
    try {
      const patient = await Patient.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      
      res.json(patient);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete patient
  async deletePatient(req, res) {
    try {
      const patient = await Patient.findByIdAndDelete(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = patientController; 