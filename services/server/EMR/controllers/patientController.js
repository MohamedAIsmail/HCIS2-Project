const asyncHandler = require("express-async-handler");
const Patient = require("../models/patientModel");

// @desc    Get list of patients
// @route   GET /api/v1/patients
// @access  Public
exports.getPatients = asyncHandler(async (req, res) => {
    const patients = await Patient.find({});
    res.status(200).json({ success: true, patients });
});

// @desc    Get specific patient by id
// @route   GET /api/v1/patients/:id
// @access  Public
exports.getPatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
        return res.status(404).json({ success: false, msg: `No patient found for this id: ${req.params.id}` });
    }
    res.status(200).json({ success: true, patient });
});

// @desc    Create patient
// @route   POST /api/v1/patients
// @access  Private
exports.createPatient = asyncHandler(async (req, res) => {
    const patient = await Patient.create(req.body);
    res.status(201).json({ success: true, patient });
});

// @desc    Update specific patient
// @route   PUT /api/v1/patients/:id
// @access  Private
exports.updatePatient = asyncHandler(async (req, res) => {

    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!patient) {
        return res.status(404).json({ success: false, msg: `No patient found for this id: ${req.params.id}` });
    }
    res.status(200).json({ success: true,  patient });
});

// @desc    Delete specific patient
// @route   DELETE /api/v1/patients/:id
// @access  Private
exports.deletePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
        return res.status(404).json({ success: false, msg: `No patient found for this id: ${req.params.id}` });
    }
    res.status(204).json({ success: true, data: {} });
});

// @desc   Delete All Patients
// @route  DELETE /api/v1/patient
// @access Private
exports.deleteAll = asyncHandler(async (req, res, next) => {
    await Patient.deleteMany({});
    res.json({ message: 'All patients have been deleted.' });
});
