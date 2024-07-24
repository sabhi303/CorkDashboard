/***
TODO:
#759
- refactor to use urls from lookup data/realtime-data-sources.json
- convert to thin controller, with application logic in service layer
***/

const mongoose = require('mongoose');

// Define schema with collection name
const dataSchema = new mongoose.Schema({
  csv_data: String
}, { collection: 'data_transport_car_parks' });

const DataModel = mongoose.model('Data', dataSchema);

const getCsvDataFromMongoDB = async () => {
  try {
    // Find the document with the CSV data
    const document = await DataModel.findOne({}, 'csv_data').exec();

    if (!document) {
      throw new Error('No data found');
    }

    return document.csv_data;
  } catch (error) {
    console.error('Error fetching CSV data:', error);
    throw error;
  }
};

exports.getLatest = async (req, res, next) => {
  try {
    const csvData = await getCsvDataFromMongoDB();
    res.send(csvData);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
};

// Controller method to handle errors
exports.getError = async (req, res, next) => {
  res.status(500).send('An error occurred');
};

// const getData = async url => {
//   const fetch = require('node-fetch')
//   try {
//     const response = await fetch(url)
//     const csv = await response.text()
//     // console.log(csv)
//     return csv
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }

// exports.getLatest = async (req, res, next) => {
//   const url = 'https://data.corkcity.ie/datastore/dump/f4677dac-bb30-412e-95a8-d3c22134e3c0?bom=True'
//   const response = await getData(url)
//   res.send(response)
// }

// exports.getError = async (req, res, next) => {
//   res.send()
// }
