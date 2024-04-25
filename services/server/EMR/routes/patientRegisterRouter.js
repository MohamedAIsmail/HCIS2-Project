const express = require("express");
const router = express.Router();

const {
    registerPatient,
} = require("../controllers/patientRegisterController");

router.post('/', registerPatient);

module.exports = router;
