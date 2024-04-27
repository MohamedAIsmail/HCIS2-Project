const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const HealthcareProvider = require("../models/healthcareProviderModel");

// @desc    Get list of healthcare providers
// @route   GET /api/v1/healthcare-providers
// @access  Public
exports.getHealthcareProviders = asyncHandler(async (req, res) => {
    const healthcareProviders = await HealthcareProvider.find({});
    res.status(200).json({ healthcareProviders });
});

// @desc    Get specific healthcare provider by id
// @route   GET /api/v1/healthcare-providers/:id
// @access  Public
exports.getHealthcareProvider = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const healthcareProvider = await HealthcareProvider.findById(id);
    if (!healthcareProvider) {
        res.status(404).json({ msg: `No healthcare provider found for this id: ${id}` });
    }
    res.status(200).json({ healthcareProvider });
});

// @desc    Create healthcare provider
// @route   POST /api/v1/healthcare-providers
// @access  Private
exports.createHealthcareProvider = asyncHandler(async (req, res) => {
    // Extract password from the request body
    const { password, ...rest } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // You can adjust the salt rounds as needed

    // Create the patient object with hashed password
    const healthcareProviderData = {
        ...rest,
        password: hashedPassword
    };

    // Create the patient in the database
    const healthcareProvider = await HealthcareProvider.create(healthcareProviderData);

    // Respond with success message and created patient data
    res.status(201).json({ success: true, healthcareProvider });
});
// exports.createHealthcareProvider = asyncHandler(async (req, res) => {
//     const {
//         username,
//         email,
//         password,
//         name,
//         specialization,
//         licenseNumber,
//         certifications,
//         schedule
//     } = req.body;

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10); // You can adjust the salt rounds as needed

//     const healthcareProvider = await HealthcareProvider.create({
//         username,
//         email,
//         hashedPassword,
//         name,
//         specialization,
//         licenseNumber,
//         certifications,
//         schedule
//     });

//     res.status(201).json({ healthcareProvider });
// });

// @desc    Update specific healthcare provider
// @route   PUT /api/v1/healthcare-providers/:id
// @access  Private
exports.updateHealthcareProvider = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    const updatedHealthcareProvider = await HealthcareProvider.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updatedHealthcareProvider) {
        res.status(404).json({ msg: `No healthcare provider found for this id: ${id}` });
    }
    res.status(200).json({ healthcareProvider: updatedHealthcareProvider });
});

// @desc    Delete specific healthcare provider
// @route   DELETE /api/v1/healthcare-providers/:id
// @access  Private
exports.deleteHealthcareProvider = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedHealthcareProvider = await HealthcareProvider.findByIdAndDelete(id);
    if (!deletedHealthcareProvider) {
        res.status(404).json({ msg: `No healthcare provider found for this id: ${id}` });
    }
    res.status(204).send();
});

// @desc   Delete All healthcare providers
// @route  DELETE /api/v1/healthcare-providers
// @access Private
exports.deleteAll = asyncHandler(async (req, res, next) => {
    await HealthcareProvider.deleteMany({});
    res.json({ message: 'All healthcare providers have been deleted.' });
});


function parseHL7Message(message) {
    const segments = message.split('\r');

    const parsedMessage = {};

    segments.forEach((segment, index) => {
        const fields = segment.split('|');
        const segmentName = fields[0];
        const segmentFields = {};

        // Names for each field in the MSH segment, excluding the last field
        const fieldNamesMSH = [
            'Encoding Characters', 'Sending Application', 'Sending Facility',
            'Receiving Application', 'Receiving Facility', 'Date/Time Of Message',
            'Security', 'Message Type', 'Message Control ID', 'Processing ID',
            'Version ID', 'Sequence Number', 'Continuation Pointer', 'Accept Acknowledgment Type',
            'Application Acknowledgment Type', 'Country Code', 'Character Set',
            'Principal Language Of Message', 'Alternate Character Set Handling Scheme'
        ];

        // Names for each field in the EVN segment
        const fieldNamesEVN = [
            'Event Type Code', 'Recorded Date/Time', 'Date/Time Planned Event', 'Event Reason Code', 'Operator ID', 'Event Occurred'
        ];

        // Names for each field in the PID segment
        const fieldNamesPID = [
            'Set ID - PID', 'Patient ID', 'Patient Identifier List', 'Alternate Patient ID - PID',
            'Patient Name', 'Mother’s Maiden Name', 'Date/Time of Birth', 'Sex', 'Patient Alias',
            'Race', 'Patient Address', 'County Code', 'Phone Number - Home', 'Phone Number - Business','Primary Language', 'Marital Status', 'Religion', 'Patient Account Number', 'SSN Number - Patient','Driver License Number - Patient', 'Mother Identifier', 'Ethnic Group', 'Birth Place','Multiple Birth Indicator', 'Birth Order', 'Citizenship', 'Veterans Military Status','Nationality','Patient Death Date and Time', 'Patient Death Indicator'
        ];
        const fieldNamesPV1 = [
            'Prior Pending Location', 'Accommodation Code', 'Admit Reason', 'Transfer Reason',
            'Patient Valuables', 'Patient Valuables Location', 'Visit User Code', 'Expected Admit Date/Time',
            'Expected Discharge Date/Time', 'Estimated Length of Inpatient Stay', 'Actual Length of Inpatient Stay',
            'Visit Description', 'Referral Source Code', 'Previous Service Date', 'Employment Illness Related Indicator',
            'Purge Status Code', 'Purge Status Date', 'Special Program Code', 'Retention Indicator',
            'Expected Number of Insurance Plans', 'Visit Publicity Code', 'Visit Protection Indicator',
            'Clinic Organization Name', 'Patient Status Code', 'Visit Priority Code', 'Previous Treatment Date',
            'Expected Discharge Disposition', 'Signature on File Date', 'First Similar Illness Date',
            'Patient Charge Adjustment Code', 'Recurring Service Code', 'Billing Media Code',
            'Expected Surgery Date & Time', 'Military Partnership Code', 'Military Non-Availability Code',
            'Newborn Baby Indicator', 'Baby Detained Indicator'];
        
        // Select field names based on segment type
        const fieldNames = segmentName === 'MSH' ? fieldNamesMSH :
            (segmentName === 'EVN' ? fieldNamesEVN :
                (segmentName === 'PID' ? fieldNamesPID : fieldNamesPV1));

        fields.slice(1).forEach((field, fieldIndex) => {
            segmentFields[fieldNames[fieldIndex]] = field;
        });

        parsedMessage[index + 1] = {
            segment: segmentName,
            fields: segmentFields
        };
    });

    return parsedMessage;
}
