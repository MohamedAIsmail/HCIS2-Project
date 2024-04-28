const { check, body } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const { comparePasswords } = require('../../utils/helperFunctions');
const Admin = require('../../models/adminModel');

exports.registerAdminValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required'),

    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (val) =>
            Admin.findOne({ email: val }).then((admin) => {
                if (admin) {
                    return Promise.reject(new Error('Email is in use'))
                }
            })
        ),

    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be longer than 6 characters')
        .custom((password, { req }) => {
            if (password !== req.body.passwordConfirm) {
                throw new Error('Password confirmaiton is incorrect');
            }
            return true;
        }),

    check('passwordConfirm')
        .notEmpty()
        .withMessage('Password confirm is required'),

    check('role')
        .custom((role) => {
            if (!(role === 'admin')) {
                throw new Error('Role must be admin');
            }
            return true;
        }),

    validatorMiddleware,
];

exports.getAdminValidator = [
    check('id')
        .isMongoId()
        .withMessage("Invalid admin ID format"),

    validatorMiddleware,
];

exports.updateAdminValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid admin ID format'),

    check('name')
        .optional(),

    check('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email address'),

    validatorMiddleware,
];

exports.deleteAdminValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Category ID Format'),

    validatorMiddleware,
];

exports.adminLoginValidator = [

    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address'),

    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be longer than 5 characters'),

    validatorMiddleware,
];

exports.changeAdminPasswordValidator = [

    check('currentPassword')
        .notEmpty()
        .withMessage('Enter your current password'),

    check('confirmPassword')
        .notEmpty()
        .withMessage('Enter the password confirmation'),

    body('newPassword')
        .notEmpty()
        .withMessage('Enter a new passowrd')
        .custom(async (val, { req }) => {

            const admin = await Admin.findById(req.params.id);

            if (!admin) {
                throw new Error('There is no admin for this id');
            };

            const isCorrectPassword = await comparePasswords(req.body.currentPassword, admin.password);

            if (!isCorrectPassword) {
                throw new Error('Incorrect password');
            };

            const equalOldPassword = await comparePasswords(val, admin.password);

            if (equalOldPassword) {
                throw new Error('Please, enter a new password');
            };

            if (val !== req.body.confirmPassword) {
                throw new Error('Password doesn\'t match password confirmation');
            };

            return true;
        }),

    validatorMiddleware,
];