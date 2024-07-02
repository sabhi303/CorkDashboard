const mongoose = require('mongoose');
const { Schema } = mongoose;

const queryLinkSchema = new Schema({
  href: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

const querySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  links: {
    type: [queryLinkSchema],
    required: true
  }
});

const Query = mongoose.model('Query', querySchema, 'queries');

module.exports = Query;