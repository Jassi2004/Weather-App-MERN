import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from '@mui/material';

const WeatherDashboard = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [savedCities, setSavedCities] = useState([]);

  // Fetch the saved cities when the user logs in
  useEffect(() => {
    const fetchSavedCities = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/api/weather/savedCity', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedCities(response.data); // Set array of saved cities
      } catch (err) {
        console.error('Error fetching saved cities:', err);
      }
    };

    fetchSavedCities();
  }, []);

  const getWeatherEmoji = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('clear')) return '☀️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('storm')) return '🌩️';
    return '🌫️'; // Default to fog/misty
  };

  const getWeatherData = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (!token) {
      setError('You must be logged in to view weather data.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/weather', {
        params: { city },
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });

      setWeather(response.data);
      setError(''); // Clear errors if successful
    } catch (err) {
      console.error('Error fetching weather data:', err.response?.status);
      setError('Unable to fetch weather data. Please check the city name or try again later.');
      setWeather(null); // Reset weather data on error
    }
  };

  const saveCity = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (!token) {
      setError('You must be logged in to save a city.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/weather/saveCity',
        { city },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        }
      );

      setSavedCities((prevCities) => [...prevCities, city]); // Update saved cities state
      setError(''); // Clear errors if successful
      console.log('City saved successfully:', response.data);
    } catch (err) {
      console.error('Error saving city:', err);
      setError('Failed to save city. Please try again later.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Weather Dashboard
      </Typography>
      <Box mb={2}>
        <TextField
          label="Enter City"
          variant="outlined"
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </Box>
      <Button variant="contained" onClick={getWeatherData} fullWidth>
        Get Weather
      </Button>

      {error && (
        <Typography color="error" align="center" mt={2}>
          {error}
        </Typography>
      )}

      {/* Show saved cities */}
      {savedCities.length > 0 && (
        <Typography align="center" mt={2}>
          Your saved cities: <strong>{savedCities.join(', ')}</strong>
        </Typography>
      )}

      {weather && weather.list ? (
        <Box mt={4}>
          <Typography variant="h6" align="center" gutterBottom>
            Weather Forecast for {weather.city.name}, {weather.city.country}
          </Typography>
          <Grid container spacing={3}>
            {weather.list.slice(0, 8).map((entry, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    backgroundColor:
                      entry.weather[0].main.toLowerCase().includes('clear')
                        ? '#ffeb3b'
                        : entry.weather[0].main.toLowerCase().includes('cloud')
                        ? '#90a4ae'
                        : entry.weather[0].main.toLowerCase().includes('rain')
                        ? '#81d4fa'
                        : '#eeeeee',
                    color: '#212121',
                    textAlign: 'center',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">
                      {new Date(entry.dt_txt).toLocaleString('en-US', {
                        weekday: 'short',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {getWeatherEmoji(entry.weather[0].description)}{' '}
                      {entry.main.temp}°C
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{ marginTop: 1 }}
                    >
                      {entry.weather[0].description.charAt(0).toUpperCase() +
                        entry.weather[0].description.slice(1)}
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                      Feels Like: {entry.main.feels_like}°C
                    </Typography>
                    <Typography variant="body2">
                      Wind: {entry.wind.speed} m/s
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Save City Button */}
          <Box mt={2} textAlign="center">
            <Button variant="outlined" color="primary" onClick={saveCity}>
              Save City
            </Button>
          </Box>
        </Box>
      ) : (
        !error &&
        weather && (
          <Typography align="center" mt={2}>
            No weather data available.
          </Typography>
        )
      )}
    </Container>
  );
};

export default WeatherDashboard;
