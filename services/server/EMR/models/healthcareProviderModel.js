const mongoose = require('mongoose');

const healthcareProviderSchema = new mongoose.Schema({
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
  specialization: { type: String, required: [true, 'specialization is required'] },
  licenseNumber: { type: String, required: [true, 'license number is required'] },
  certifications: [{ type: String, required: [true, 'certifications is required'] }],
  schedule: {
    availability: [{ type: String }], // Days of the week, e.g., ["Monday", "Tuesday"]
    appointmentSlots: [{
      day: { type: String },
      time: { type: String }
    }]
  }
},
  { timestamps: true } // time stamps will create two fields in database, "created at and updated at"
);

const HealthcareProvider = mongoose.model('HealthcareProvider', healthcareProviderSchema);

module.exports = HealthcareProvider;