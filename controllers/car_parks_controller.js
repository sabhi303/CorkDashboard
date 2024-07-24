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
