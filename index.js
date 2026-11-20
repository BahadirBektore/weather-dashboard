import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

// EJS configuration
app.set("view engine", "ejs");

// Static files
app.use(express.static("public"));

// Weather descriptions based on WMO weather codes

const weatherDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snowfall",
  73: "Moderate snowfall",
  75: "Heavy snowfall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  97: "Strong thunderstorm",
  99: "Thunderstorm with heavy hail"
};



function getWeatherIcon(code) {
  const weatherIcons = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌦️",
    53: "🌦️",
    55: "🌧️",
    56: "🌧️",
    57: "🌧️",
    61: "🌧️",
    63: "🌧️",
    65: "🌧️",
    66: "🌧️",
    67: "🌧️",
    71: "❄️",
    73: "❄️",
    75: "❄️",
    77: "🌨️",
    80: "🌦️",
    81: "🌧️",
    82: "🌧️",
    85: "🌨️",
    86: "🌨️",
    95: "⛈️",
    96: "⛈️",
    99: "⛈️"
  };

  return weatherIcons[code] || "🌡️";
}


// Convert weather code into a English description
function getWeatherDescription(code) {
  return weatherDescriptions[code] || "Unknown weather condition";
}


// Home route
app.get("/", (req, res) => {
  res.render("index", {
    location: null,
    weather: null
  });
});

// Geocoding API route
app.get("/geocode", async (req, res) => {
  try {
    const city = req.query.city;

    // Check if city name exists
    if (!city || !city.trim()) {
      return res.status(400).json({
        error: "Please enter a city name."
      });
    }

    // Send request to Open-Meteo Geocoding API
    const response = await axios.get(
      "https://geocoding-api.open-meteo.com/v1/search",
      {
        params: {
          name: city.trim(),
          count: 5,
          language: "en",
          format: "json",
        },
        timeout: 10000
      }
    );

    // Get location results
    const locations = response.data.results || [];

    // Check if location was found
    if (locations.length === 0) {
      return res.status(404).json({
        error: "City not found."
      });
    }

    // Return location data
    res.json(locations);

  } catch (error) {
    console.error(
      "Geocoding error:",
      error.response?.data || error.message
    );

    res.status(error.response?.status || 500).json({
      error: "Unable to retrieve location data."
    });
  }
});


// Weather API route
app.get("/weather", async (req, res) => {
  
  const city = req.query.city;
  
  try {
    

    // Check if city name exists
    if (!city || !city.trim()) {
      return res.status(400).render("index", {
        location: null,
        weather: null,
        errorMessage: "Please enter a city name.",
        searchedCity: ""
      });
    }

    // Step 1: Get city coordinates
    const geoResponse = await axios.get(
      "https://geocoding-api.open-meteo.com/v1/search",
      {
        params: {
          name: city.trim(),
          count: 1,
          language: "en",
          format: "json",
        },
        timeout: 10000
      }
    );

    const locations = geoResponse.data.results || [];

    // Check if city was found
    if (locations.length === 0) {
      return res.status(404).render("index", {
       location: null,
       weather: null,
      errorMessage: "City not found. Please try another city.",
      searchedCity: city.trim()
      });
    }

    const location = locations[0];

    // Step 2: Get weather data
    const weatherResponse = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
          hourly: "temperature_2m,precipitation_probability,weather_code",
          daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
          timezone: "auto",
          forecast_days: 7
        },
        timeout: 10000
      }
    );
    
    

    // Step 3: Render the weather page
    // Render the weather page
    res.render("index", {
      location,
      searchedCity: city.trim(),
      weather: weatherResponse.data,
      weatherDescription: getWeatherDescription(
        weatherResponse.data.current.weather_code
      ),
      getWeatherDescription,
      getWeatherIcon
    });

    } catch (error) {
      console.error(
        "Weather error:",
        error.response?.data || error.message
      );

      res.status(500).render("index", {
        location: null,
        weather: null,
        errorMessage:
          "Unable to retrieve weather data. Please try again later.",
        searchedCity: city?.trim() || ""
      });
    }
});


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
