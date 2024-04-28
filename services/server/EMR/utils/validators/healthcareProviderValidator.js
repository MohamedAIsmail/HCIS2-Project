const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const HealthcareProvider = require('../../models/healthcareProviderModel');

exports.createHealthcareProviderValidator = [
    check('username')
        .notEmpty()
        .withMessage('Username is required'),
        
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (val) => {
            return HealthcareProvider.findOne({ email: val }).then((found) => {
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
    
    check('specialization')
        .notEmpty()
        .withMessage('Specialization is required'),
    
    check('licenseNumber')
        .notEmpty()
        .withMessage('License number is required'),
    
    check('certifications')
        .isArray({ min: 1 })
        .withMessage('At least one certification is required'),

    check('schedule')
        .isObject()
        .withMessage('Schedule must be an object'),

    validatorMiddleware,
];

exports.updateHealthcareProviderValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid healthcare provider ID format'),

    check('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (val, { req }) => {
            return HealthcareProvider.findOne({ email: val }).then((found) => {
                if (found && found._id.toString() !== req.params.id) {
                    return Promise.reject(new Error('Email is already in use'));
                }
            });
        }),
    
    validatorMiddleware,
];

exports.getHealthcareProviderValidator = [
    check('id')
        .isMongoId()
        .withMessage("Invalid healthcare provider ID format"),

    validatorMiddleware,
];

exports.deleteHealthcareProviderValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid healthcare provider ID Format'),

    validatorMiddleware,
];