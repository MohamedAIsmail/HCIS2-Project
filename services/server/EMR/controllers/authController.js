const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { createToken, comparePasswords } = require('../utils/helperFunctions');
const sendEmail = require('../utils/sendEmail');
const ApiError = require('../utils/apiError');
const Admin = require('../models/adminModel');

// @desc   Login
// @route  POST /api/v1/auth/login
// @access Public
exports.adminLogin = asyncHandler(async (req, res, next) => {

    const admin = await Admin.findOne({ email: req.body.email });

    let isEqual = false

    if (admin) {
        isEqual = await comparePasswords(req.body.password, admin.password);
    };

    if (!admin || !isEqual) {
        return next(new ApiError('Incorrect email or password', 401));
    };

    const token = await createToken(admin._id);

    res.cookie('authToken', token);

    res.status(200).json({ data: admin, token });
});

// @desc   Logout Admin
// @route  GET /api/v1/auth/login
// @access Public
exports.adminLogout = asyncHandler(async (req, res, next) => {

    res.clearCookie('authToken');
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private, max-age=0');
    res.status(200).json({ message: "Cookie is deleted successfully" });
});


// @desc    make sure the admin is logged in
exports.protect = asyncHandler(async (req, res, next) => {

    // 1- check the token existance
    const token = req.cookies.authToken;

    if (!token) {
        return next(new ApiError('You are not logged in. Please, login to get access this route', 401));
    };

    // 2- Verify token (no change is made in payload, expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // returns the payload of the token "_id"

    // 3- Check if admin exists in database
    const currentAdmin = await Admin.findById(decoded.adminId);
    if (!currentAdmin) {
        return next(new ApiError('Admin that belong to this token does no longer exist', 401));
    }

    // 4- Check if admin change his password after token is created
    if (currentAdmin.passwordChangedAt) {
        // if admin changed password then we parse the time changed at then convert it to seconds from ms
        const passwordChangedTimeStamp = parseInt(currentAdmin.passwordChangedAt.getTime() / 1000, 10);

        // if true "time of changing password is after his token creation" so password changed after token created (Error, admin must login again so we redirect admin to the login page)
        if (passwordChangedTimeStamp > decoded.iat) {
            return next(new ApiError('Admin has recently changed his password. Please login again..'), 401);
        };
    };

    // to access the request for next middleware "allowedTo"
    req.admin = currentAdmin;

    next();
});

// @ desc   Authorization (Admin Permissions)
// roles: ['admin', 'sub-admin']
// (..roles) is a function that return async middleware
// closures
exports.allowedTo = (...roles) => asyncHandler(async (req, res, next) => {
    // 1- access roles
    // 2- access registered admin
    if (!roles.includes(req.admin.role)) {
        return next(new ApiError('You are not allowed to access this route', 403));
    };

    next();
});


// @desc   Forget Password
// @route  POST /api/v1/auth/forgetPassowrd
// @access Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
    // 1- Get admin by email
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
        return next(new ApiError(`There is no admin with that email: ${req.body.email}`, 404));
    };
    // 2- if admin exists "email in database", generate 6 digits radnomly and save it in db then hash them
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // hashing password reset code before saving it in database 
    const cryptedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

    // save hashed password reset code into database
    admin.passwordResetCode = cryptedResetCode;

    // add expiration time for password reset code "10 minute"
    admin.passwordResetExpiration = Date.now() + 10 * 60 * 1000;

    // verify code is false by default
    admin.passwordResetVerification = false;

    await admin.save();

    const message =
        `<p>Dear ${admin.email.split('@')[0].split('.')[0]},</p>
    <p>We have received a request to reset your password. Please enter the following code to complete the process.</p>
    <p>${resetCode}</p>
    <p>Thanks for helping us keep your account secure</p>
    <p>Best regards,<br>ASME CUSB Team</p>`

    // 3- Send the reset code via email
    // asyncHandler catches error by try catch here is used to set the attributes to undefined to not be stored in database and the response is failed asln!
    try {
        await sendEmail({
            email: admin.email,
            subject: 'Your Password Reset  Code (Valid For 10 Minutes)',
            message: message,
        });

    } catch (error) {
        admin.passwordResetCode = undefined;
        admin.passwordResetExpiration = undefined;
        admin.passwordResetVerification = undefined;

        await admin.save();
        return (new ApiError('There is an error in sending email'));
    };

    res.status(200).json({ status: 'success', message: 'Reset code is sent via email' });
});

// @desc   Verify Password Reset code
// @route  POST /api/v1/auth/verifyResetCode
// @access Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
    // 1- get admin based on his reset code that is encrypted

    // crypting the body reset code to compare to the one in database
    const cryptedResetCode =
        crypto.createHash('sha256')
            .update(req.body.resetCode)
            .digest('hex');

    // getting the admin based on the reset code and checking its expiraiton validity
    const admin = await Admin.findOne({
        passwordResetCode: cryptedResetCode,
        passwordResetExpiration: { $gte: Date.now() },
    });

    if (!admin) {
        return next(new ApiError('Reset code invalid or expired'));
    };

    admin.passwordResetVerification = true;

    await admin.save();

    res.status(200).json({
        status: 'success',
    });
});

// @desc   Reset Password
// @route  POST /api/v1/auth/resetPassword
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // get admin based on email
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
        return next(new ApiError(`There is no admin with this email: ${req.body.email}`, 404));
    };

    // check if reset code is veified
    if (!admin.passwordResetVerification) {
        return next(new ApiError('Reset code is not verified', 400));
    };

    // if verified update the reset values to undefined
    admin.password = req.body.newPassword;
    admin.passwordResetCode = undefined;
    admin.passwordResetExpiration = undefined;
    admin.passwordResetVerification = undefined;

    await admin.save();

    // generate new token for the admin ba2a
    const token = await createToken(admin._id);

    res.status(200).json({ token: token });
});