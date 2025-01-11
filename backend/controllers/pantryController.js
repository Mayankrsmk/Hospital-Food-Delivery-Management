const MealPlan = require('../models/MealPlan');
const User = require('../models/User');

const pantryController = {
  // Get all assigned meal tasks for pantry
  async getAssignedTasks(req, res) {
    try {
      const tasks = await MealPlan.find({ assignedTo: req.user._id })
        .populate('patient', 'name roomNumber bedNumber floorNumber')
        .sort({ date: 1 });
      
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update meal preparation status
  async updateMealStatus(req, res) {
    try {
      const { mealPlanId, status } = req.body;
      
      const mealPlan = await MealPlan.findById(mealPlanId);
      if (!mealPlan) {
        return res.status(404).json({ message: 'Meal plan not found' });
      }

      if (mealPlan.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this meal plan' });
      }

      mealPlan.status = status;
      await mealPlan.save();

      res.json(mealPlan);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all delivery personnel
  async getDeliveryPersonnel(req, res) {
    try {
      const deliveryStaff = await User.find({ role: 'delivery' })
        .select('-password')
        .sort({ name: 1 });
      
      res.json(deliveryStaff);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Assign meal to delivery personnel
  async assignDeliveryPerson(req, res) {
    try {
      const { mealPlanId, deliveryPersonId } = req.body;

      const mealPlan = await MealPlan.findById(mealPlanId);
      if (!mealPlan) {
        return res.status(404).json({ message: 'Meal plan not found' });
      }

      const deliveryPerson = await User.findOne({ 
        _id: deliveryPersonId, 
        role: 'delivery' 
      });
      if (!deliveryPerson) {
        return res.status(404).json({ message: 'Delivery person not found' });
      }

      mealPlan.assignedTo = deliveryPersonId;
      mealPlan.status = 'ready';
      await mealPlan.save();

      res.json(mealPlan);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get meal delivery tracking details
  async getDeliveryTracking(req, res) {
    try {
      const deliveries = await MealPlan.find({
        status: { $in: ['ready', 'delivered'] },
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59)),
        }
      })
      .populate('patient', 'name roomNumber bedNumber floorNumber')
      .populate('assignedTo', 'name contactInfo')
      .sort({ date: 1 });

      res.json(deliveries);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = pantryController; 