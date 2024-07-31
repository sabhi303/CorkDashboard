const express = require('express')
const fs = require('fs')
const router = express.Router({
  mergeParams: true
})

router.get('/', function (req, res, next) {
  res.render('api')
})

const airQualityController = require('../controllers/air_quality_controller')
router.get('/air-quality/latest', airQualityController.getLatest)

const carParksController = require('../controllers/car_parks_controller')
router.get('/carparks/error', carParksController.getError)
router.get('/carparks/latest', carParksController.getLatest)

const waterLevelController = require('../controllers/water_levels')
router.get('/water-levels/stations/list', waterLevelController.getStationsList)
router.get('/water-levels/stations/:ts', waterLevelController.getStationsData)

const weatherController = require('../controllers/weather_controller')
// router.get('/weather/model', weatherController.getWeatherModel)
router.get('/weather/latest', weatherController.getWeatherLatest)


// Themes Housing Data
const themesHousingController = require('../controllers/themes_housing_controller')
router.get('/themes/housing', themesHousingController.getData)

// Themes Transport Data
const themesTransportController = require('../controllers/themes_transport_controller')
router.get('/themes/transport', themesTransportController.getData)

// Themes Population Data
const themesPopulationController = require('../controllers/themes_population_controller')
router.get('/themes/population', themesPopulationController.getData)

// Themes Economy Data
const themesEconomyController = require('../controllers/themes_economy_controller')
router.get('/themes/economy', themesEconomyController.getData)

module.exports = router
