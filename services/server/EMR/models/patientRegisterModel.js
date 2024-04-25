const mongoose = require('mongoose');

const patientRegisterationSchema = new mongoose.Schema(
    {
        setID: { type: String },

        patientID: { type: String },

        patientIdentifierList: { type: String },

        alternatePatientID: { type: String },

        patientName: { type: String },

        mothersMaidenName: { type: String },

        dateTimeOfBirth: { type: Date },

        sex: { type: String },

        patientAlias: { type: String },

        race: { type: String },

        patientAddress: { type: String },

        countyCode: { type: String },

        phoneNumberHome: { type: String },

        phoneNumberBusiness: { type: String },

        primaryLanguage: { type: String },

        maritalStatus: { type: String },

        religion: { type: String },

        patientAccountNumber: { type: String },

        ssnNumberPatient: { type: String, required: [true, 'This field is essential to complete the registeration'] },

        driverLicenseNumberPatient: { type: String },

        motherIdentifier: { type: String },

        ethnicGroup: { type: String },

        birthPlace: { type: String },

        multipleBirthIndicator: { type: String },

        birthOrder: { type: String },

        citizenship: { type: String },

        veteransMilitaryStatus: { type: String },

        nationality: { type: String },

        patientDeathDateTime: { type: Date },
        
        patientDeathIndicator: { type: String },
    }, 

    { timestamps: true }
);

const PatientRegister = mongoose.model('PatientRegister', patientRegisterationSchema);

module.exports = PatientRegister;
