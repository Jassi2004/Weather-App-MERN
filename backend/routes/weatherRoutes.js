const express = require('express');
const { getWeather, saveCity, getSavedCity } = require('../controllers/weatherController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Get weather data for a specified city
router.get('/weather', getWeather); 

// Save city route - Requires authentication
router.post('/weather/saveCity', authMiddleware, saveCity);

// Get saved city route - Requires authentication
router.get('/weather/savedCity', authMiddleware, getSavedCity);

module.exports = router;
