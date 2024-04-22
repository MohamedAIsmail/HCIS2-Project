const express = require("express");

const {
    createPatient,
    getPatients,
    getPatient,
} = require("../controllers/patientController");

const router = express.Router();

router.route("/patientsData").get(getPatients).post(createPatient);

router.route("/patientsData/:id").get(getPatient);

module.exports = router;
