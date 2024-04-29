const express = require('express');
const router = express.Router();

const {
    createAppointment,
} = require('../controllers/createAppointmentController');

router.route('/:id').post(createAppointment)

module.exports = router;