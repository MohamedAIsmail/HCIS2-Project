const ApiError = require("../utils/apiError");

// in develpoment mode we send the whole error details to track the error
const sendErrorForDev = (err, res) => {
    // sending a response in a json file "No need for next()"
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

// in production mode we send the error status and message only 
const sendErrorForProd = (err, res) => {
    // sending a response in a json file "No need for next()"
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};

// when payload is changed 
const handleJwtInvalidSignature = () => new ApiError('Invalid token, please login again', 401);

// when token expired "the 90d configured in .env"
const handleJwtExpired = () => new ApiError('Expired token, please login again', 401);

/*
we use this function in index.js, in express it consider any function 
with 4 arguments an error function and provide the first parameter as error
*/
const globalError = (err, req, res, next) => {

    // if the error has status code so be it but if it hasn't so it is set to be 500 'General error,  internal server error'
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Development mode
    if (process.env.NODE_ENV === 'development') {
        sendErrorForDev(err, res);
    }
    
    // Production Mode
    else {
        if (err.name === 'JsonWebTokenError') {
            err = handleJwtInvalidSignature();
        }
        else if (err.name === 'TokenExpiredError') {
            err = handleJwtExpired();
        }
        sendErrorForProd(err, res);
    }
};

module.exports = globalError;
