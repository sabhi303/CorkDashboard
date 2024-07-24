const mongoose = require('mongoose');

// Define schema with collection name
const waterLevelSchema = new mongoose.Schema({
  water_levels: Object
}, { collection: 'data_environment_water_levels' });

const WaterLevelModel = mongoose.model('WaterLevel', waterLevelSchema);


const getWaterLevelsFromMongoDB = async () => {
  try {
    // Find the document with water levels
    const document = await WaterLevelModel.findOne({}, 'water_levels').exec();

    if (!document) {
      throw new Error('No data found');
    }


    return document.water_levels;
  } catch (error) {
    console.error('Error fetching water levels data:', error);
    throw error;
  }
};

// Controller method to handle fetching and sending the filtered water levels data
exports.getStationsList = async (req, res, next) => {
  try {
    const waterLevels = await getWaterLevelsFromMongoDB();
    res.send(waterLevels);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
};



const getData = async url => {
  const fetch = require('node-fetch')
  try {
    const response = await fetch(url)
    const json = await response.text()

    // console.log("\n******\nExample : " + JSON.stringify(json) + "\n******\n");
    // console.log(json);
    return json
  } catch (error) {
    return console.log(error)
  }
}

// /* Station list data format */
// // {
// // "st_ADDRESS": "Clarendon Row",
// // "st_CONTRACTNAME": "Dublin",
// // "st_ID": 1,
// // "st_LATITUDE": 53.340927,
// // "st_LONGITUDE": -6.262501,
// // "st_NAME": "CLARENDON ROW"
// // }
// // exports.getStationsList
// exports.getStationsList = async (req, res, next) => {
//   // console.log('\n\n**********Get Stations List******************\n')
//   const url = 'https://waterlevel.ie/geojson/latest/'
//   const response = await getData(url)
//   res.send(response)
// }

exports.getStationsData = async (req, res, next) => {
  // console.log("\n\n**********Get Stations List******************\n");
  const ts = req.params.ts
  const url = 'http://waterlevel.ie/data/month/' + ts
  // let url = "http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML";
  const response = await getData(url)
  res.send(response)
}
