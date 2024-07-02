const mongoose = require('mongoose');
const { Schema } = mongoose;


const querySchema = new Schema({
  id: String,
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  linkname: {
    type: String,
    required: true
  },
  linkhref: {
    type: String,
    required: true
  },
});

const Query = mongoose.model('Query', querySchema, 'queries');

module.exports = Query;