const asyncHandler = require("express-async-handler");
const HealthcareProvider = require('../models/healthcareProviderModel');


exports.getAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const healthcareProvider = await HealthcareProvider.findById(id);
        if (!healthcareProvider) {
            return res.status(404).json({ success: false, message: 'No healthcare provider found for this ID' });
        }
        res.status(200).json({ success: true, schedule: healthcareProvider.schedule });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.toString() });
    }
});