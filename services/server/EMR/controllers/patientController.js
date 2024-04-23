const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const Patient = require("../models/patientModel");

// @desc    Get list of patients
// @route   GET /api/v1/patients
// @access  Public
exports.getPatients = asyncHandler(async (req, res) => {
    const patients = await Patient.find({});
    res.status(200).json({ patients });
});

// @desc    Get specific patient by id
// @route   GET /api/v1/patients/:id
// @access  Public
exports.getPatient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    if (!patient) {
        res.status(404).json({ msg: `No patient found for this id: ${id}` });
    }
    res.status(200).json({ patient });
});

// @desc    Create patient
// @route   POST /api/v1/patients
// @access  Private
exports.createPatient = asyncHandler(async (req, res) => {
    const {
        weight,
        height,
        age,
        bloodType,
        allergies,
        medications,
        surgeries,
        chronicConditions,
        lastVisit,
        nextAppointment,
        insuranceProvider,
        insurancePolicyNumber,
        emergencyContacts
    } = req.body;

    const patient = await Patient.create({
        weight,
        height,
        age,
        bloodType,
        allergies,
        medications,
        surgeries,
        chronicConditions,
        lastVisit,
        nextAppointment,
        insuranceProvider,
        insurancePolicyNumber,
        emergencyContacts
    });

    res.status(201).json({ patient });
});

// @desc    Update specific patient
// @route   PUT /api/v1/patients/:id
// @access  Private
exports.updatePatient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updatedPatient) {
        res.status(404).json({ msg: `No patient found for this id: ${id}` });
    }
    res.status(200).json({ patient: updatedPatient });
});

// @desc    Delete specific patient
// @route   DELETE /api/v1/patients/:id
// @access  Private
exports.deletePatient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedPatient = await Patient.findByIdAndDelete(id);
    if (!deletedPatient) {
        res.status(404).json({ msg: `No patient found for this id: ${id}` });
    }
    res.status(204).send();
});
