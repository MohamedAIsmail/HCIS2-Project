const express = require("express");
const router = express.Router();

const {
    createHealthcareProviderValidator,
    getHealthcareProviderValidator,
    updateHealthcareProviderValidator,
    deleteHealthcareProviderValidator,
} = require("../utils/validators/healthcareProviderValidator");

const {
    createHealthcareProvider,
    getHealthcareProviders,
    getHealthcareProvider,
    updateHealthcareProvider,
    deleteHealthcareProvider,
    getBookedPatients
} = require("../controllers/healthcareProviderController");

router.route("/").get(getHealthcareProviders).post(createHealthcareProvider);

router.route("/:id")
    .get(getBookedPatients)
    .get(getHealthcareProviderValidator, getHealthcareProvider)
    .put(updateHealthcareProviderValidator, updateHealthcareProvider)
    .delete(deleteHealthcareProviderValidator, deleteHealthcareProvider);

module.exports = router;
