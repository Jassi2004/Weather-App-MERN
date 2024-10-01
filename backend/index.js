const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const errorHandler = require('./utils/errorHandler');

// Initialize environment variables
dotenv.config();
connectDB(); // Connect to MongoDB
const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// Routes
app.use('/api', authRoutes);
app.use('/api', weatherRoutes);

// Catch all for non-existing routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
