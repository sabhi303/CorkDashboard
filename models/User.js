const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: String, // this should be hashed, let's see
  email: String,
});

const User = mongoose.model('User', userSchema, "users");

module.exports = User;