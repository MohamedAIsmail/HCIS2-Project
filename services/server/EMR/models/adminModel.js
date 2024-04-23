const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Too short password'],
        },

        role: {
            type: String,
            enum: ['admin', 'sub-admin'],
            default: 'admin',
        },

        passwordChangedAt: Date,

        passwordResetCode: String,

        passwordResetExpiration: Date,

        passwordResetVerification: Boolean,

    },
    { timestamps: true }
);

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;