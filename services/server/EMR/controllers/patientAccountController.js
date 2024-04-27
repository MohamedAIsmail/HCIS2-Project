const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const PatientAccount = require("../models/patientAccountModel");

// @desc    Get list of patients
// @route   GET /api/v1/patients
// @access  Public
exports.getPatients = asyncHandler(async (req, res) => {
    const patients = await PatientAccount.find({});
    res.status(200).json({ success: true, patients });
});

// @desc    Get specific patient by id
// @route   GET /api/v1/patients/:id
// @access  Public
exports.getPatient = asyncHandler(async (req, res) => {
    const patient = await PatientAccount.findById(req.params.id);
    if (!patient) {
        return res.status(404).json({ success: false, msg: `No patient found for this id: ${req.params.id}` });
    }
    res.status(200).json({ success: true, patient });
});

// @desc    Create patient
// @route   POST /api/v1/patients
// @access  Private
exports.createPatient = asyncHandler(async (req, res) => {
    // Extract password from the request body
    const { password, ...rest } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // You can adjust the salt rounds as needed

    // Create the patient object with hashed password
    const patientData = {
        ...rest,
        password: hashedPassword
    };

    // Create the patient in the database
    const patient = await PatientAccount.create(patientData);

    // Respond with success message and created patient data
    res.status(201).json({ success: true, patient });
});

// @desc    Update specific patient
// @route   PUT /api/v1/patients/:id
// @access  Private
exports.updatePatient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    const patient = await PatientAccount.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true,
    });
    if (!patient) {
        return res.status(404).json({ success: false, msg: `No patient found for this id: ${id}` });
    }
    res.status(200).json({ success: true, patient });
});

// @desc    Delete specific patient
// @route   DELETE /api/v1/patients/:id
// @access  Private
exports.deletePatient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedPatient = await PatientAccount.findByIdAndDelete(id);
    if (!deletedPatient) {
        return res.status(404).json({ success: false, msg: `No patient found for this id: ${id}` });
    }
    res.status(204).json({ success: true, data: {} });
});

// @desc   Delete All Patients
// @route  DELETE /api/v1/patients
// @access Private
exports.deleteAll = asyncHandler(async (req, res) => {
    await PatientAccount.deleteMany({});
    res.json({ message: 'All patients have been deleted.' });
});
