const express = require("express");

const {
    createPatient,
    getPatients,
    getPatient,
    updatePatient,
} = require("../controllers/patientController");

const router = express.Router();

router.route("/patientsData").get(getPatients).post(createPatient);

router.route("/patientsData/:id").get(getPatient).put(updatePatient);

module.exports = router;
