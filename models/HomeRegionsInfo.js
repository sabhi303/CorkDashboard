const mongoose = require('mongoose');
const { Schema } = mongoose;

const regionSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  English: {
    type: String,
    required: true
  },
  GAEILGE: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const RegionsInfo = mongoose.model('RegionsInfo', regionSchema, 'home-regions-info');

module.exports = RegionsInfo;
