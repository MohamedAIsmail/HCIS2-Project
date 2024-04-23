const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
        },

        Weight: {
            type: String,
        },

        Height: {
            type: String,
        },

        Age: {
            type: String,
        },

        Complaints: [
            {
                ComplaintID: { type: mongoose.Schema.Types.ObjectId },
                Description: { type: String },
            },
        ],

        Drugs: [
            {
                DrugID: { type: mongoose.Schema.Types.ObjectId },
                PrescriptionID: { type: mongoose.Schema.Types.ObjectId },
                PatientID: { type: mongoose.Schema.Types.ObjectId },
                DrugName: { type: String },
                DrugDuration: { type: String },
                DrugDose: { type: String },
            },
        ],

        EyeMeasurements: [
            {
                EyeMeasurementID: { type: mongoose.Schema.Types.ObjectId },
                AppointmentID: { type: mongoose.Schema.Types.ObjectId },
                LeftEye: { type: String },
                RightEye: { type: String },
            },
        ],

        Illnesses: [
            {
                IllnessID: { type: mongoose.Schema.Types.ObjectId },
                PatientID: { type: mongoose.Schema.Types.ObjectId },
                IllnessDescription: { type: String },
            },
        ],

        Operations: [
            {
                OperationID: { type: mongoose.Schema.Types.ObjectId },
                OperationName: { type: String },
                OperationDescription: { type: String },
            },
        ],

        Prescriptions: [
            {
                PrescriptionID: { type: mongoose.Schema.Types.ObjectId },
                PatientID: { type: mongoose.Schema.Types.ObjectId },
                AppointmentID: { type: mongoose.Schema.Types.ObjectId },
                DoctorName: { type: String },
                Diagnosis: { type: String },
                ExtraNotes: { type: String },
                CreatedAt: { type: Date, default: Date.now },
            },
        ],

        Recommendations: [
            {
                RecommendationID: { type: mongoose.Schema.Types.ObjectId },
                AppointmentID: { type: mongoose.Schema.Types.ObjectId },
                RecommendationDescription: { type: String },
            },
        ],

        Vaccines: [
            {
                VaccineID: { type: mongoose.Schema.Types.ObjectId },
                PatientID: { type: mongoose.Schema.Types.ObjectId },
                VaccineName: { type: String },
                VaccineType: { type: String },
                VaccineDate: { type: Date },
            },
        ],

        Vitals: [
            {
                VitalID: { type: mongoose.Schema.Types.ObjectId },
                PatientID: { type: mongoose.Schema.Types.ObjectId },
                BloodPressure: { type: String },
                RespirationRate: { type: String },
                HeartRate: { type: String },
                DiabeticTest: { type: String },
            },
        ],
    },
    { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
