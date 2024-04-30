const asyncHandler = require("express-async-handler");
const HealthcareProvider = require("../models/healthcareProviderModel");
const PatientAccount = require("../models/patientAccountModel");

// @desc    Get all patients who booked appointments with a specific healthcare provider
// @route   GET /api/v1/healthcareProvider/:doctorId
// @access  Healthcare provider only
exports.getBookedPatients = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const doctor = await HealthcareProvider.findById(id);
    if (!doctor) {
        return res.status(404).json({ success: false, message: `No doctor found` });
    };

    const bookedAppointments = doctor.schedule.filter(appointment => appointment.booked === true);

    const bookedPatientIds = bookedAppointments.map(appointment => appointment.patientID);

    const bookedPatients = await PatientAccount.find({ _id: { $in: bookedPatientIds } });

    res.status(200).json(bookedPatients);
});

// @desc    Get list of healthcare providers
// @route   GET /api/v1/healthcareProvider
// @access  Public
exports.getHealthcareProviders = asyncHandler(async (req, res) => {
    const healthcareProviders = await HealthcareProvider.find({});
    res.status(200).json({ healthcareProviders });
});

// @desc    Get specific healthcare provider by id
// @route   GET /api/v1/healthcareProvider/:id
// @access  Public
exports.getHealthcareProvider = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const healthcareProvider = await HealthcareProvider.findById(id);
    if (!healthcareProvider) {
        res.status(404).json({ message: `No healthcare provider found for this id: ${id}` });
    }
    res.status(200).json({ healthcareProvider });
});

// @desc    Create healthcare provider
// @route   POST /api/v1/healthcareProvider
// @access  Private
exports.createHealthcareProvider = asyncHandler(async (req, res) => {
    const healthcareProvider = await HealthcareProvider.create(req.body);
    res.status(201).json({ healthcareProvider });
});

// @desc    Update specific healthcare provider
// @route   PUT /api/v1/healthcareProvider/:id
// @access  Private
exports.updateHealthcareProvider = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;
    const updatedHealthcareProvider = await HealthcareProvider.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updatedHealthcareProvider) {
        res.status(404).json({ message: `No healthcare provider found for this id: ${id}` });
    }
    res.status(200).json({ updatedHealthcareProvider });
});

// @desc    Delete specific healthcare provider
// @route   DELETE /api/v1/healthcareProvider/:id
// @access  Private
exports.deleteHealthcareProvider = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedHealthcareProvider = await HealthcareProvider.findByIdAndDelete(id);
    if (!deletedHealthcareProvider) {
        res.status(404).json({ message: `No healthcare provider found for this id: ${id}` });
    }
    res.status(204).send();
});

// @desc   Delete All healthcare providers
// @route  DELETE /api/v1/healthcareProvider
// @access Private
exports.deleteAll = asyncHandler(async (req, res, next) => {
    await HealthcareProvider.deleteMany({});
    res.json({ message: 'All healthcare providers have been deleted.' });
});