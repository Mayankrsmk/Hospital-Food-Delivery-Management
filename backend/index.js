require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const pantryRoutes = require('./routes/pantryRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const managerRoutes = require('./routes/managerRoutes');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/pantry', pantryRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/manager', managerRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Hospital Food Manager API' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
