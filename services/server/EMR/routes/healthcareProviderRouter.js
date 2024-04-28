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

router.route("/")
    .get(getHealthcareProviders)
    .post(createHealthcareProviderValidator, createHealthcareProvider);

router.route("/:id")
    .get(getHealthcareProviderValidator, getHealthcareProvider)
    .put(updateHealthcareProviderValidator, updateHealthcareProvider)
    .delete(deleteHealthcareProviderValidator, deleteHealthcareProvider);

module.exports = router;
