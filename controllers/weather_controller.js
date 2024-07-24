/***
TODO:
#759
- refactor to use urls from lookup data/realtime-data-sources.json
- convert to thin controller, with application logic in service layer
***/

const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
  weather_data: String
}, { collection: 'data_weather' });

const WeatherDataModel = mongoose.model('WeatherData', weatherDataSchema);

const getWeatherDataFromMongoDB = async () => {
  try {
    // Find the document with weather data
    const document = await WeatherDataModel.findOne({}, 'weather_data').exec();

    if (!document) {
      throw new Error('No data found');
    }

    return document.weather_data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Controller method to handle fetching and sending the weather data
exports.getWeatherLatest = async (req, res, next) => {
  try {
    const weatherData = await getWeatherDataFromMongoDB();
    res.send(weatherData);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
};

// const getData = async url => {
//   const fetch = require('node-fetch')
//   try {
//     const response = await fetch(url)
//     const xml = await response.text()
//     return xml
//   } catch (error) {
//     return console.log(error)
//   }
// }

// // exports.getWeatherModel = async (req, res, next) => {
// //   const url = 'http://metwdb-openaccess.ichec.ie/metno-wdb2ts/locationforecast?lat=54.7210798611;long=-8.7237392806'
// //   const response = await getData(url)
// //   res.send(response)
// // }

// exports.getWeatherLatest = async (req, res, next) => {
//   const url = 'https://www.met.ie/Open_Data/xml/obs_present.xml'
//   const response = await getData(url)
//   res.send(response)
// }
