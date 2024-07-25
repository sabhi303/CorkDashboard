const mongoose = require('mongoose');

// Define schema with collection name
const themesTransportSchema = new mongoose.Schema({
  data: Object
}, { collection: 'data_themes_transport' });

const ThemesTransportModel = mongoose.model('ThemesTransport', themesTransportSchema);


const getThemesTransportFromMongoDB = async () => {
  try {
    // Find the document with water levels
    const document = await ThemesTransportModel.findOne({}, 'data').exec();

    if (!document) {
      throw new Error('No data found');
    }

    return document.data;
  } catch (error) {
    console.error('Error fetching water levels data:', error);
    throw error;
  }
};

exports.getData = async (req, res, next) => {
    try {
      const jsonData = await getThemesTransportFromMongoDB();
      res.send(jsonData);
    } catch (error) {
      next(error); // Pass error to the error handling middleware
    }
  };
  
  // Controller method to handle errors
  exports.getError = async (req, res, next) => {
    res.status(500).send('An error occurred');
  };