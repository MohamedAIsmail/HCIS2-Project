const express = require('express');


const {
    createPatient,
    getPatients,
    getPatient,
    updatePatient,
} = require('../controllers/patientController');

const router = express.Router();

router.route('/')
    .get(getPatients)
    .post(createPatient)

router.route('/:id')
    .get(getPatient)
    .put(updatePatient)

module.exports = router;