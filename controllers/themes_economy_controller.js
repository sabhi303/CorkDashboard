const mongoose = require('mongoose');

// Define schema with collection name
const themesEconomySchema = new mongoose.Schema({
  data: Object
}, { collection: 'data_themes_economy' });

const ThemesEconomyModel = mongoose.model('ThemesEconomy', themesEconomySchema);


const getThemesEconomyFromMongoDB = async () => {
  try {
    const document = await ThemesEconomyModel.findOne({}, 'data').exec();

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
      const jsonData = await getThemesEconomyFromMongoDB();
      res.send(jsonData);
    } catch (error) {
      next(error); // Pass error to the error handling middleware
    }
  };
  
  // Controller method to handle errors
  exports.getError = async (req, res, next) => {
    res.status(500).send('An error occurred');
  };