const asyncHandler = require("express-async-handler");
const ReceptionistModel = require("../models/receptionistModel");


// @desc    Create patient
// @route   POST /api/v1/patient
// @access  Private
exports.createReceptionist = asyncHandler(async (req, res) => {
    const patient = await ReceptionistModel.create(req.body);
    res.status(201).json({ patient });
});