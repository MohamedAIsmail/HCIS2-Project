const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Public
exports.getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json({ users });
});

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Public
exports.getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        res.status(404).json({ msg: `No user found for this id: ${id}` });
    }
    res.status(200).json({ user });
});

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private
exports.createUser = asyncHandler(async (req, res) => {
    const { type, username, password, email, profile } = req.body;
    const user = await User.create({ type, username, password, email, profile });
    res.status(201).json({ user });
});

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { type, username, password, email, profile } = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, { type, username, password, email, profile }, { new: true });
    if (!updatedUser) {
        res.status(404).json({ msg: `No user found for this id: ${id}` });
    }
    res.status(200).json({ user: updatedUser });
});

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
        res.status(404).json({ msg: `No user found for this id: ${id}` });
    }
    res.status(204).send();
});
