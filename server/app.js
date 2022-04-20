require('dotenv').config();
const { default: axios } = require('axios');
const express = require('express');
const Datastore = require('nedb');
const app = express();

const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('../client'));
app.use(express.json({ limit: '1mb' }));

// Database
const db = new Datastore({ filename: 'database.db', autoload: true });

app.get('/weather/:latlon', async (req, res) => {
  try {
    const latlon = req.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    // OpenWeather - Current Weather API
    const currentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`;
    const weather_res = await axios.get(currentWeather);
    // OpenWeather - Air Pollution API
    const airPollution = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}`;
    const air_res = await axios.get(airPollution);

    const data = {
      weather: weather_res.data,
      air_quality: air_res.data.list[0].main.aqi,
    };

    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

app.post('/api', (req, res) => {
  const data = req.body;
  db.insert(data);
  res.json(data);
});

app.listen(port, () => {
  console.log(`Weather API listening at http://localhost:${port}`);
});
