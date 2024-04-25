const mongoose = require('mongoose');

// Define a sub-schema for schedule
const scheduleSchema = new mongoose.Schema({
  appointmentReason: { type: String, enum: ["ROUTINE", "WALKIN", "FOLLOWUP", "EMERGENCY"] }, 
  appointmentDuration: { type: String },
  requestedStartDateTimeRange: { type: String },
  priorityARQ: { type: String, enum: ["Stat", "ASAP", "Routine", "Timing critical"]},
  repeatingInterval: { type: String },
  repeatingIntervalDuration: { type: String },
  placerContactPerson: { type: String }, 
  PlacerContactPhoneNumber: { type: Number }
});

const healthcareProviderSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: [true, "username is required"] 
    },

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
    
    specialization: { 
      type: String, 
      required: [true, 'specialization is required'] 
    },

    licenseNumber: { 
      type: String, 
      required: [true, 'license number is required'] 
    },

    certifications: [{ 
      type: String, 
      required: [true, 'certifications is required'] 
    }],

    schedule: [scheduleSchema]
  },

  { timestamps: true } 
);

const HealthcareProvider = mongoose.model('HealthcareProvider', healthcareProviderSchema);

module.exports = HealthcareProvider;