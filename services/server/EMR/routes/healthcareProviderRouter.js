const express = require("express");
const router = express.Router();

const {
    createHealthcareProvider,
    getHealthcareProviders,
    getHealthcareProvider,
    updateHealthcareProvider,
    deleteHealthcareProvider
} = require("../controllers/healthcareProviderController");

// Route to get all healthcare providers and create a new provider
router.route("/")
    .get(getHealthcareProviders)
    .post(createHealthcareProvider);

// Route to get, update, and delete a specific healthcare provider by ID
router.route("/:id")
    .get(getHealthcareProvider)
    .put(updateHealthcareProvider)
    .delete(deleteHealthcareProvider);

module.exports = router;
