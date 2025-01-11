const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner'],
    required: true,
  },
  ingredients: [{
    name: String,
    quantity: String,
  }],
  specialInstructions: [{
    type: String,
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
});

const mealPlanSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  meals: {
    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema,
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'delivering', 'delivered'],
    default: 'pending',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  deliveryNotes: String,
  deliveredAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('MealPlan', mealPlanSchema); 