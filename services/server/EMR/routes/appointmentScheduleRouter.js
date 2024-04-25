const express = require("express");
const router = express.Router();

const {
    createAppointment,
} = require("../controllers/appointmentScheduleController");

router.put('/:id', createAppointment);

module.exports = router;
