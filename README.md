# Weather Dashboard 🌦️

A responsive weather dashboard built with **Node.js, Express, EJS, and Open-Meteo API**.

Search for cities around the world and explore current weather conditions, hourly forecasts, and a 7-day weather forecast.

## Features

- Search for cities worldwide
- Display current weather conditions
- Show temperature, feels-like temperature, humidity, and wind speed
- 24-hour hourly weather forecast
- 7-day weather forecast
- Local timezone support for searched cities
- Weather condition descriptions and icons
- Light and dark themes
- Responsive glassmorphism design
- Error handling for invalid city searches and API failures
- No API key required

## Technologies Used

- Node.js
- Express.js
- EJS
- Axios
- HTML5
- CSS3
- Open-Meteo API

## Installation

1. Clone the repository:

```bash
git clone https://github.com/BahadirBektore/weather-dashboard.git
```

2. Navigate to the project directory:

```bash
cd weather-dashboard
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser:

```text
http://localhost:3000
```

## API

Weather data is provided by [Open-Meteo](https://open-meteo.com/).

City coordinates are retrieved using the Open-Meteo Geocoding API.

No API key is required.

## License

This project is available for educational and portfolio purposes.

Weather data attribution: [Open-Meteo](https://open-meteo.com/).