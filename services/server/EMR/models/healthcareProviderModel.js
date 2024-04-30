const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const scheduleSchema = new mongoose.Schema(
  {
    appointmentReason: { type: String, enum: ["ROUTINE", "WALKIN", "FOLLOWUP", "EMERGENCY"] }, 

    appointmentTime: { type: String },

    appointmentDuration: { type: String },

    requestedStartDateTimeRange: { type: String },

    priorityARQ: { type: String, enum: ["Stat", "ASAP", "Routine", "Timing critical"]},

    repeatingInterval: { type: String },

    repeatingIntervalDuration: { type: String },

    placerContactPerson: { type: String }, 

    PlacerContactPhoneNumber: { type: String },

    booked: { type: Boolean, default: false },

    patientID: {} 

  }, 
  { timestamps: true }
);

const healthcareProviderSchema = new mongoose.Schema(
  {
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

    role: {
      type: String,
      default: "doctor" 
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

healthcareProviderSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const HealthcareProvider = mongoose.model('HealthcareProvider', healthcareProviderSchema);

module.exports = HealthcareProvider;