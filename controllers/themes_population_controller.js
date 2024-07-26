const mongoose = require('mongoose');

// Define schema with collection name
const themesPopulationSchema = new mongoose.Schema({
  data: Object
}, { collection: 'data_themes_demographics_population' });

const ThemesPopulationModel = mongoose.model('ThemesPopulation', themesPopulationSchema);


const getThemesHousingFromMongoDB = async () => {
  try {
    // Find the document with water levels
    const document = await ThemesPopulationModel.findOne({}).exec();

    if (!document) {
      throw new Error('No data found');
    }

    return document;
  } catch (error) {
    console.error('Error fetching water levels data:', error);
    throw error;
  }
};

exports.getData = async (req, res, next) => {
    try {
      const jsonData = await getThemesHousingFromMongoDB();
      res.send(jsonData);
    } catch (error) {
      next(error); // Pass error to the error handling middleware
    }
  };
  
  // Controller method to handle errors
  exports.getError = async (req, res, next) => {
    res.status(500).send('An error occurred');
  };