const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// to create token we pass data, the secret key and the expiration time
// each admin has unique id and also the secret key both make token unique
exports.createToken = async (payLoad) => {
    return jwt.sign({ adminId: payLoad }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_TIME });
};

exports.comparePasswords = (plainPassword, hashedPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, hashedPassword, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};