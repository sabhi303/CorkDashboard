const mongoose = require('mongoose');
const { Schema } = mongoose;

const aboutCardSchema = new Schema({
  _id: Schema.Types.ObjectId,
  id: String,
  header: String,
  twitterHandle: String,
  description: String,
  additionalInfo: String
});

const AboutCard = mongoose.model('AboutCard', aboutCardSchema, 'home');

module.exports = AboutCard;