const express = require("express");
const router = express.Router();

const {
    createHealthcareProviderValidator,
    getHealthcareProviderValidator,
    updateHealthcareProviderValidator,
    deleteHealthcareProviderValidator
} = require('../utils/validators/healthcareProviderValidator');

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
    .post(createHealthcareProviderValidator, createHealthcareProvider);

// Route to get, update, and delete a specific healthcare provider by ID
router.route("/:id")
    .get(getHealthcareProviderValidator, getHealthcareProvider)
    .put(updateHealthcareProviderValidator, updateHealthcareProvider)
    .delete(deleteHealthcareProviderValidator, deleteHealthcareProvider);

module.exports = router;
