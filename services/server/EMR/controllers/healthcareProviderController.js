const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const HealthcareProvider = require("../models/healthcareProviderModel");

// @desc    Get list of healthcare providers
// @route   GET /api/v1/healthcare-providers
// @access  Public
exports.getHealthcareProviders = asyncHandler(async (req, res) => {
    const healthcareProviders = await HealthcareProvider.find({});
    res.status(200).json({ healthcareProviders });
});

// @desc    Get specific healthcare provider by id
// @route   GET /api/v1/healthcare-providers/:id
// @access  Public
exports.getHealthcareProvider = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const healthcareProvider = await HealthcareProvider.findById(id);
    if (!healthcareProvider) {
        res.status(404).json({ msg: `No healthcare provider found for this id: ${id}` });
    }
    res.status(200).json({ healthcareProvider });
});

// @desc    Create healthcare provider
// @route   POST /api/v1/healthcare-providers
// @access  Private
exports.createHealthcareProvider = asyncHandler(async (req, res) => {
    const {
        username,
        email,
        password,
        name,
        specialization,
        licenseNumber,
        certifications,
        schedule
    } = req.body;

    const healthcareProvider = await HealthcareProvider.create({
        username,
        email,
        password,
        name,
        specialization,
        licenseNumber,
        certifications,
        schedule
    });

    res.status(201).json({ healthcareProvider });
});

// @desc    Update specific healthcare provider
// @route   PUT /api/v1/healthcare-providers/:id
// @access  Private
exports.updateHealthcareProvider = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    const updatedHealthcareProvider = await HealthcareProvider.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updatedHealthcareProvider) {
        res.status(404).json({ msg: `No healthcare provider found for this id: ${id}` });
    }
    res.status(200).json({ healthcareProvider: updatedHealthcareProvider });
});

// @desc    Delete specific healthcare provider
// @route   DELETE /api/v1/healthcare-providers/:id
// @access  Private
exports.deleteHealthcareProvider = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedHealthcareProvider = await HealthcareProvider.findByIdAndDelete(id);
    if (!deletedHealthcareProvider) {
        res.status(404).json({ msg: `No healthcare provider found for this id: ${id}` });
    }
    res.status(204).send();
});
