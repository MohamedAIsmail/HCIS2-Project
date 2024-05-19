const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const patientAccountSchema = new mongoose.Schema(
    {
        patientId: { type: Number },
        
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password should be at least 6 characters long'],
        },

        role: {
            type: String,
            default: 'patient' 
        },

        name: {
            type: String,
            required: [true, 'Name is required'],
        },

        ssnNumberPatient: { 
            type: String, 
            required: [true, 'This field is essential to complete the signup'] 
        },

        phoneNumber: {
        type: String,
        required: [true, 'You must enter your phone number'],
        },
        
        weight: { 
            type: Number, 
            required: [true, "Weight is required"] 
        },

        height: { 
            type: Number, 
            required: [true, "Height is required"] 
        },

        age: { 
            type: Number, 
            required: [true, "Age is required"] 
        },

        gender: { 
            type: String, 
            required: [true, "Gender is required"] 
        },

        emergencyContacts: [{
            name: { type: String },
            relationship: { type: String },
            contact: { type: String },
        }],
        
        insuranceProvider: { 
            type: String 
        },

        insurancePolicyNumber: { 
            type: String 
        },

        medicalHistory: {
            bloodType: { type: String },

            bloodPressure: { type: Number },

            respirationRate: { type: Number },

            heartRate: { type: Number },

            diabeticTest: { type: Number },

            allergies: [{ type: String }],

            medications: [{ type: String }],

            surgeries: [{ type: String }],

            chronicConditions: [{ type: String }],

            lastVisit: { type: Date },

            nextAppointment: { type: Date },

            note: { type: String },

            prescriptions: [{
                id: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
                diagnosis: { type: String },
                date: { type: Date },
            }],

            drugs: [{
                id: { type: mongoose.Schema.Types.ObjectId, ref: 'Drug' },
                drugDose: { type: String },
                drugDuration: { type: String },
                drugName: { type: String },
                date: { type: Date },
            }]
        }
    }, 

    { timestamps: true }
);

patientAccountSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const PatientAccount = mongoose.model('PatientAccount', patientAccountSchema);

module.exports = PatientAccount;