const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Patient = require('../../models/patientModel');

exports.createPatientValidator = [
    check('username')
        .notEmpty()
        .withMessage('Username is required'),

    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (val) => {
            return Patient.findOne({ email: val }).then((found) => {
                if (found) {
                    return Promise.reject(new Error('Email is already in use'));
                }
            });
        }),

    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    check('name')
        .notEmpty()
        .withMessage('Name is required'),

    check('phoneNumber')
        .notEmpty()
        .withMessage('Phone number is required'),

    check('weight')
        .notEmpty()
        .withMessage('Weight is required')
        .isNumeric()
        .withMessage('Weight must be a number'),

    check('height')
        .notEmpty()
        .withMessage('Height is required')
        .isNumeric()
        .withMessage('Height must be a number'),

    check('age')
        .notEmpty()
        .withMessage('Age is required')
        .isNumeric()
        .withMessage('Age must be a number'),

    check('medicalHistory.bloodType')
        .notEmpty()
        .withMessage('Blood type is required'),

    check('emergencyContacts')
        .isArray({ min: 1 })
        .withMessage('At least one emergency contact is required'),

    validatorMiddleware,
];

exports.updatePatientValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid patient ID format'),

    check('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (val, { req }) => {
            return Patient.findOne({ email: val }).then((found) => {
                if (found && found._id.toString() !== req.params.id) {
                    return Promise.reject(new Error('Email is already in use'));
                }
            });
        }),

    check('weight')
        .optional()
        .isNumeric()
        .withMessage('Weight must be a number'),

    check('height')
        .optional()
        .isNumeric()
        .withMessage('Height must be a number'),

    check('age')
        .optional()
        .isNumeric()
        .withMessage('Age must be a number'),

    validatorMiddleware,
];

exports.getPatientValidator = [
    check('id')
        .isMongoId()
        .withMessage("Invalid patient ID format"),

    validatorMiddleware,
];

exports.deletePatientValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid patient ID Format'),

    validatorMiddleware,
];
