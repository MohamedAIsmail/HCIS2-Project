const express = require('express');
const router = express.Router();

const {
    registerPatient,
} = require('../controllers/patientRegisterController');

router.route('/').post(registerPatient)

module.exports = router;