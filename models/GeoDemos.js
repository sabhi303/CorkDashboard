const mongoose = require('mongoose');
const { Schema } = mongoose;

const geoDemosSchema = new Schema({
  id: String || int,
  description: {
    type: String,
    required: true
  }
});

const GeoDemos = mongoose.model('GeoDemos', geoDemosSchema, 'queries-geodemos-group-description');

module.exports = GeoDemos;