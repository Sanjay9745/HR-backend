// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  fullName: {type: String},
  user_type: {type: String, default: 'hradmin'},
  date: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('User', userSchema);
