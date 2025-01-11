const MealPlan = require('../models/MealPlan');

const deliveryController = {
  // Get assigned deliveries for the logged-in delivery person
  async getAssignedDeliveries(req, res) {
    try {
      const deliveries = await MealPlan.find({
        assignedTo: req.user._id,
        status: { $in: ['ready', 'delivering'] }
      })
      .populate('patient', 'name roomNumber bedNumber floorNumber')
      .sort({ date: 1 });

      res.json(deliveries);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Mark delivery as completed
  async completeDelivery(req, res) {
    try {
      const { mealPlanId, deliveryNotes } = req.body;

      const mealPlan = await MealPlan.findById(mealPlanId);
      if (!mealPlan) {
        return res.status(404).json({ message: 'Meal plan not found' });
      }

      // Verify that this delivery is assigned to the current user
      if (mealPlan.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          message: 'Not authorized to update this delivery' 
        });
      }

      // Update delivery status and notes
      mealPlan.status = 'delivered';
      mealPlan.deliveryNotes = deliveryNotes;
      mealPlan.deliveredAt = new Date();
      await mealPlan.save();

      res.json(mealPlan);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update delivery status to "delivering"
  async startDelivery(req, res) {
    try {
      const { mealPlanId } = req.body;

      const mealPlan = await MealPlan.findById(mealPlanId);
      if (!mealPlan) {
        return res.status(404).json({ message: 'Meal plan not found' });
      }

      if (mealPlan.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          message: 'Not authorized to update this delivery' 
        });
      }

      mealPlan.status = 'delivering';
      await mealPlan.save();

      res.json(mealPlan);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get delivery history
  async getDeliveryHistory(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      const query = {
        assignedTo: req.user._id,
        status: 'delivered'
      };

      if (startDate && endDate) {
        query.deliveredAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const deliveries = await MealPlan.find(query)
        .populate('patient', 'name roomNumber bedNumber floorNumber')
        .sort({ deliveredAt: -1 });

      res.json(deliveries);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = deliveryController; 