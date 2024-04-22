const express = require('express');


const {
    createPatient,
    getPatients,
    getPatient,
} = require('../controllers/patientController');

const router = express.Router();

router.route('/')
    .get(getPatients)
    .post(createPatient)

router.route('/:id')
    .get(getPatient)

module.exports = router;