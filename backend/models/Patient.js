const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  diseases: [{
    type: String,
  }],
  allergies: [{
    type: String,
  }],
  roomNumber: {
    type: String,
    required: true,
  },
  bedNumber: {
    type: String,
    required: true,
  },
  floorNumber: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  contactInformation: {
    phone: String,
    email: String,
    address: String,
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
  },
  dietaryRestrictions: [{
    type: String,
  }],
  admissionDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['admitted', 'discharged'],
    default: 'admitted',
  },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema); 