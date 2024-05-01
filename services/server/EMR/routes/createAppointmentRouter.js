const express = require('express');
const router = express.Router();
const {getAppointment } = require('../controllers/getAppoitmentController');

const {
    createAppointment,
} = require('../controllers/createAppointmentController');

router.route('/:id').post(createAppointment)
router.route('/:patientId/:doctorId').get(getAppointment);

module.exports = router;