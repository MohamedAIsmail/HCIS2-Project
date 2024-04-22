const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },

        weight: {
            type: String,
        },

        height: {
            type: String,
        },

        age: {
            type: String,
        },

        complaints: [
            {
                complaintID: { type: mongoose.Schema.Types.ObjectId  },
                description: { type: String  }
            }
        ],

        drugs: [
            {
                drugID: { type: mongoose.Schema.Types.ObjectId  },
                prescriptionID: { type: mongoose.Schema.Types.ObjectId  },
                patientID: { type: mongoose.Schema.Types.ObjectId  },
                drugName: { type: String  },
                drugDuration: { type: String },
                drugDose: { type: String }
            }
        ],

        eyeMeasurements: [
            {
                eyeMeasurementID: { type: mongoose.Schema.Types.ObjectId  },
                appointmentID: { type: mongoose.Schema.Types.ObjectId  },
                leftEye: { type: String },
                rightEye: { type: String }
            }
        ],

        illnesses: [
            {
                illnessID: { type: mongoose.Schema.Types.ObjectId  },
                patientID: { type: mongoose.Schema.Types.ObjectId  },
                illnessDescription: { type: String  }
            }
        ],

        operations: [
            {
                operationID: { type: mongoose.Schema.Types.ObjectId  },
                operationName: { type: String  },
                operationDescription: { type: String }
            }
        ],

        prescriptions: [
            {
                prescriptionID: { type: mongoose.Schema.Types.ObjectId  },
                patientID: { type: mongoose.Schema.Types.ObjectId  },
                appointmentID: { type: mongoose.Schema.Types.ObjectId  },
                doctorName: { type: String },
                diagnosis: { type: String },
                extraNotes: { type: String },
                createdAt: { type: Date, default: Date.now }
            }
        ],

        recommendations: [
            {
                recommendationID: { type: mongoose.Schema.Types.ObjectId  },
                appointmentID: { type: mongoose.Schema.Types.ObjectId  },
                recommendationDescription: { type: String }
            }
        ],

        vaccines: [
            {
                vaccineID: { type: mongoose.Schema.Types.ObjectId  },
                patientID: { type: mongoose.Schema.Types.ObjectId  },
                vaccineName: { type: String },
                vaccineType: { type: String },
                vaccineDate: { type: Date }
            }
        ],

        vitals: [
            {
                vitalID: { type: mongoose.Schema.Types.ObjectId  },
                patientID: { type: mongoose.Schema.Types.ObjectId  },
                bloodPressure: { type: String },
                respirationRate: { type: String },
                heartRate: { type: String },
                diabeticTest: { type: String }
            }
        ]
    },
    { timestamps: true }
);

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
