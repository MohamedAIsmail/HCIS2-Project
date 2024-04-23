const express = require("express");
const router = express.Router();

const {
    createPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient
} = require("../controllers/patientController");

// Route to get all patients and create a new patient
router.route("/")
    .get(getPatients)
    .post(createPatient);

// Route to get, update, and delete a specific patient by ID
router.route("/:id")
    .get(getPatient)
    .put(updatePatient)
    .delete(deletePatient);

module.exports = router;
