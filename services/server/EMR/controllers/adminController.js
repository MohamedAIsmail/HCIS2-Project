const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Admin = require('../models/adminModel');
const { createToken } = require('../utils/helperFunctions');

// @desc    Create a new admin
// @route   POST /api/v1/admin
// @access  Public
exports.registerAdmin = asyncHandler(async (req, res) => {

    const admin = await Admin.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password, // passowrd will be hashed in adminModel.js
        role: req.body.role,
    });

    const token = await createToken(admin._id);

    res.status(201).json({ admin, token });
});

// @desc    Get list of admins
// @route   GET /api/v1/admin
// @access  Private (admin only)
exports.getAdmins = asyncHandler(async (req, res) => {
    const admins = await Admin.find({});
    res.status(200).json({ admins });
});

// @desc    Get specific admin by id
// @route   GET /api/v1/admin/:id
// @access  Private (admin only)
exports.getAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
        res.status(404).json({ message: `No admin found for this id: ${id}` });
    };
    res.status(200).json({ admin });
});

// @desc    Update specific admin
// @route   PUT /api/v1/admin/:id
// @access  Private (admin only)
exports.updateAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updatedAdmin) {
        res.status(404).json({ message: `No admin found for this id: ${id}` });
    }
    res.status(200).json({ updatedAdmin });
});

// @desc   Update Admin Password
// @route  PATCH /api/v1/admin/changePassword
// @access Private
exports.updateAdminPassword = asyncHandler(async (req, res, next) => {

    const adminId = req.params.id;

    const admin = await Admin.findByIdAndUpdate(
        adminId,
        {
            password: await bcrypt.hash(req.body.newPassword, 12),
            passwordChangedAt: Date.now(),
        },
        { new: true }
    );

    if (!admin) {
        return next(new ApiError(`No document for this ID: ${adminId}`, 404));
    };

    res.status(200).json({ admin });

});

// @desc    Delete specific admin
// @route   DELETE /api/v1/admin/:id
// @access  Private (admin only)
exports.deleteAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedAdmin = await Admin.findByIdAndDelete(id);
    if (!deletedAdmin) {
        res.status(404).json({ message: `No admin found for this id: ${id}` });
    }
    res.status(204).send();
});

// @desc   Delete All Admins
// @route  DELETE /api/v1/admin
// @access Private
exports.deleteAll = asyncHandler(async (req, res, next) => {
    await Admin.deleteMany({});
    res.json({ message: 'All admins have been deleted.' });
});