const asyncHandler = require("express-async-handler");
const PatientAccount = require("../models/patientAccountModel");
const HealthcareProvider = require("../models/healthcareProviderModel");
const PatientRegister = require("../models/patientRegisterModel");

// @desc    Book appointment
// @route   PUT /api/v1/patient/:patientId/:doctorId/:appointmentId
// @access  Patient only
exports.bookAppointment = asyncHandler(async (req, res) => {
    const { patientId, doctorId, appointmentId } = req.params;
    const { booked, patientID } = req.body;

    const patient = await PatientAccount.findById(patientId);
    if (!patient) {
        return res
            .status(404)
            .json({ success: false, message: `No patient found` });
    }

    const doctor = await HealthcareProvider.findOneAndUpdate(
        { _id: doctorId, "schedule._id": appointmentId },
        {
            $set: {
                "schedule.$.booked": booked,
                "schedule.$.patientID": patientID,
            },
        },
        { new: true, runValidators: true }
    );

    if (!doctor) {
        return res
            .status(404)
            .json({
                success: false,
                message: `No doctor or appointment found`,
            });
    }

    res.status(200).json({ doctor });
});

// @desc    Get list of patients
// @route   GET /api/v1/patient
// @access  Public
exports.getPatients = asyncHandler(async (req, res) => {
    const patients = await PatientRegister.find({});
    res.status(200).json({ patients });
});

// @desc    Get specific patient by id
// @route   GET /api/v1/patient/:id
// @access  Public
exports.getPatient = asyncHandler(async (req, res) => {
    const patient = await PatientAccount.findById(req.params.id);
    if (!patient) {
        return res
            .status(404)
            .json({
                success: false,
                message: `No patient found for this id: ${req.params.id}`,
            });
    }
    res.status(200).json({ patient });
});

// @desc    Create patient
// @route   POST /api/v1/patient
// @access  Private
exports.createPatient = asyncHandler(async (req, res) => {
    const patient = await PatientAccount.create(req.body);
    res.status(201).json({ patient });
});

// @desc    Update specific patient
// @route   PUT /api/v1/patient/:id
// @access  Private
exports.updatePatient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    const patient = await PatientAccount.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true,
    });
    if (!patient) {
        return res
            .status(404)
            .json({
                success: false,
                message: `No patient found for this id: ${id}`,
            });
    }
    res.status(200).json({ patient });
});

// @desc    Delete specific patient
// @route   DELETE /api/v1/patient/:id
// @access  Private
exports.deletePatient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedPatient = await PatientAccount.findByIdAndDelete(id);
    if (!deletedPatient) {
        return res
            .status(404)
            .json({
                success: false,
                message: `No patient found for this id: ${id}`,
            });
    }
    res.status(204).json({ data: {} });
});

// @desc   Delete All Patients
// @route  DELETE /api/v1/patient
// @access Private
exports.deleteAll = asyncHandler(async (req, res) => {
    await PatientAccount.deleteMany({});
    res.json({ message: "All patients have been deleted." });
});
