const mongoose = require('mongoose');
const User = require('./User');

const patientSchema = new mongoose.Schema({
  weight: { type: Number },
  height: { type: Number },
  age: { type: Number }
});

const Patient = User.discriminator('Patient', patientSchema);

module.exports = Patient;