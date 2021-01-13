const express = require('express');

const router = express.Router();

// Require controller modules.
const weatherController = require('../controllers/weatherController');

// GET main weather page.
router.get('/', weatherController.weather_index);

// POST main weather page.
router.post('/current', weatherController.current_post);

// GET weather forecast page
router.get('/forecast', weatherController.weather_forecast);

// POST weather forecast page
router.post('/forecast', weatherController.weather_forecast_post);

// GET daily forecast page
router.get('/daily', weatherController.weather_daily);

// POST daily forecast page
router.post('/daily', weatherController.weather_daily_post);

module.exports = router;
