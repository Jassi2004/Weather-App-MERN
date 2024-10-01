const City = require('../models/city');

// Get weather data for a specified city
exports.getWeather = async (req, res) => {
  const { city } = req.query; // Get city from query parameters
  // Replace YOUR_API_KEY with your actual OpenWeatherMap API key
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.cod !== '200') {
      return res.status(404).json({ message: 'City not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ message: 'Error fetching weather data' });
  }
};

// Save city route
exports.saveCity = async (req, res) => {
  const userId = req.user.id; // Get user ID from authenticated user
  const { cityName } = req.body; // Get city name from request body

  try {
    const city = new City({ userId, name: cityName });
    await city.save();
    res.status(201).json({ message: 'City saved successfully!' });
  } catch (error) {
    console.error('Error saving city:', error);
    res.status(500).json({ message: 'Error saving city' });
  }
};

// Get saved city route
exports.getSavedCity = async (req, res) => {
  const userId = req.user.id; // Get user ID from authenticated user

  try {
    const cities = await City.find({ userId }); // Find cities for the logged-in user
    res.status(200).json(cities);
  } catch (error) {
    console.error('Error fetching saved cities:', error);
    res.status(500).json({ message: 'Error fetching saved cities' });
  }
};
