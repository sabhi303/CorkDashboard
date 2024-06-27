const mongoose = require('mongoose');
const { Schema } = mongoose;

const regiosnSchema = new Schema({
    _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  translations: {
    type: Map,
    of: {
      English: String,
      GAEILGE: String,
      description: String
    }
  }
});

const RegionsInfo = mongoose.model('RegionsInfo', regiosnSchema, 'home-regions-info');

module.exports = RegionsInfo;