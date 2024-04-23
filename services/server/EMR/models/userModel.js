const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  type: { type: String, enum: ['patient', 'healthcareProvider', 'administrator'], required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String },
  profile: {
    name: { type: String, required: true },
    contact: { type: String }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;