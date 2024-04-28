const express = require("express");
const router = express.Router();

const {
    createPatientValidator,
    getPatientValidator,
    updatePatientValidator,
    deletePatientValidator
} = require('../utils/validators/patientAccountValidator');

const {
    createPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient
} = require("../controllers/patientAccountController");

router.route("/")
    .get(getPatients)
    .post(createPatientValidator, createPatient);

router.route("/:id")
    .get(getPatientValidator, getPatient)
    .put(updatePatientValidator, updatePatient)
    .delete(deletePatientValidator, deletePatient);

module.exports = router;
