const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const receptionistSchema = new mongoose.Schema(
    {
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
            default: 'receptionist',
        },

    },
    { timestamps: true }
);

receptionistSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const Receptionist = mongoose.model('Receptionist', receptionistSchema);

module.exports = Receptionist;