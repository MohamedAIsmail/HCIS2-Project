const express = require("express");
const router = express.Router();

const {
    createAppointment,
} = require("../controllers/appointmentScheduleController");

console.log("router")

router.post('/:id', createAppointment);

module.exports = router;
