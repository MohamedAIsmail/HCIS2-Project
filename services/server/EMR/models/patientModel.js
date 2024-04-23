const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  username: { type: String, required: [true, "username is required"] },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Too short password'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  contact: { type: String, required: [true, 'contact is required'] },
  weight: { type: Number, required: [true, "weight is required"] },
  height: { type: Number, required: [true, "height is required"] },
  age: { type: Number, required: [true, "age is required"] },
  bloodType: { type: String , required: [true, "blood type is required"] },
  allergies: [{ type: String }],
  medications: [{ type: String }],
  surgeries: [{ type: String }],
  chronicConditions: [{ type: String }],
  lastVisit: { type: Date },
  nextAppointment: { type: Date },
  insuranceProvider: { type: String },
  insurancePolicyNumber: { type: String },
  emergencyContacts: {
    type: [{
        name: { type: String },
        relationship: { type: String },
        contact: { type: String },
    }],
    validate: [arrayMinLength, 'At least one emergency contact is required']
  }
},
{ timestamps: true });

function arrayMinLength(val) {
  return val.length > 0;
}

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;