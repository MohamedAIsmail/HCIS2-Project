const slugify = require('slugify');
const asyncHandler = require('express-async-handler');

const Patient = require('../models/patientModel');

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getPatients = asyncHandler(async (req, res) => {

  const patients = await Patient.find({});
  res.status(200).json({ data: patients });
});

// @desc    Get specific Patient by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getPatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findById(id);
  if (!patient) {
    res.status(404).json({ msg: `No Patient for this id ${id}` });
  }
  res.status(200).json({ data: patient });
});

// @desc    Create Patient
// @route   POST  /api/v1/categories
// @access  Private
exports.createPatient = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const patient = await Patient.create({ name });
  res.status(201).json({ data: patient });
});

// @desc    Update specific Patient
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updatePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const Patient = await Patient.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );

  if (!Patient) {
    res.status(404).json({ msg: `No Patient for this id ${id}` });
  }
  res.status(200).json({ data: Patient });
});

// @desc    Delete specific Patient
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deletePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Patient = await Patient.findByIdAndDelete(id);

  if (!Patient) {
    res.status(404).json({ msg: `No Patient for this id ${id}` });
  }
  res.status(204).send();
});