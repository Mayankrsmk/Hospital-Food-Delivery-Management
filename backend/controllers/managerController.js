const MealPlan = require('../models/MealPlan');
const Patient = require('../models/Patient');
const User = require('../models/User');

const managerController = {
  // Get dashboard overview
  async getDashboardStats(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const stats = {
        totalPatients: await Patient.countDocuments({ status: 'admitted' }),
        todayMeals: await MealPlan.countDocuments({ 
          date: { 
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }),
        pendingDeliveries: await MealPlan.countDocuments({ 
          status: { $in: ['pending', 'preparing', 'ready'] }
        }),
        completedDeliveries: await MealPlan.countDocuments({
          status: 'delivered',
          date: { 
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        })
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all meal deliveries with status
  async getAllDeliveries(req, res) {
    try {
      const { status, startDate, endDate } = req.query;
      
      const query = {};
      
      if (status) {
        query.status = status;
      }
      
      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const deliveries = await MealPlan.find(query)
        .populate('patient', 'name roomNumber bedNumber floorNumber')
        .populate('assignedTo', 'name')
        .sort({ date: -1 });

      res.json(deliveries);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get pantry performance metrics
  async getPantryMetrics(req, res) {
    try {
      const pantryStaff = await User.find({ role: 'pantry' });
      
      const metrics = await Promise.all(
        pantryStaff.map(async (staff) => {
          const completedMeals = await MealPlan.countDocuments({
            assignedTo: staff._id,
            status: 'delivered'
          });

          const delayedMeals = await MealPlan.countDocuments({
            assignedTo: staff._id,
            status: { $in: ['pending', 'preparing'] },
            date: { $lt: new Date() }
          });

          return {
            staffId: staff._id,
            name: staff.name,
            completedMeals,
            delayedMeals,
            efficiency: completedMeals / (completedMeals + delayedMeals) * 100 || 0
          };
        })
      );

      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get delayed deliveries and preparation issues
  async getAlerts(req, res) {
    try {
      const currentTime = new Date();
      
      // Find delayed meals
      const delayedMeals = await MealPlan.find({
        status: { $in: ['pending', 'preparing'] },
        date: { $lt: currentTime }
      })
      .populate('patient', 'name roomNumber bedNumber')
      .populate('assignedTo', 'name');

      // Find meals with preparation issues (no assigned staff)
      const unassignedMeals = await MealPlan.find({
        assignedTo: null,
        date: { 
          $gte: currentTime,
          $lt: new Date(currentTime.getTime() + 24 * 60 * 60 * 1000)
        }
      })
      .populate('patient', 'name roomNumber bedNumber');

      res.json({
        delayedMeals,
        unassignedMeals,
        totalAlerts: delayedMeals.length + unassignedMeals.length
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = managerController; 