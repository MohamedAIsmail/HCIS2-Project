const asyncHandler = require("express-async-handler");
const Patient = require("../models/patientModel");

// @desc    Get list of patients
// @route   GET /api/v1/patients
// @access  Public
exports.getPatients = asyncHandler(async (req, res) => {
    const patients = await Patient.find({});
    res.status(200).json({ success: true, patients });
});

// @desc    Get specific patient by id
// @route   GET /api/v1/patients/:id
// @access  Public
exports.getPatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
        return res.status(404).json({ success: false, msg: `No patient found for this id: ${req.params.id}` });
    }
    res.status(200).json({ success: true, patient });
});

// @desc    Create patient
// @route   POST /api/v1/patients
// @access  Private
exports.createPatient = asyncHandler(async (req, res) => {
    const message = parseHL7Message(req.body.hl7Message)
    // fill this with required patient data
    // const patient_data = {
    // }
    // const patient = await Patient.create(patient_data);
    res.status(201).json({ success: true, message });
});

// @desc    Update specific patient
// @route   PUT /api/v1/patients/:id
// @access  Private
exports.updatePatient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    const patient = await Patient.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true,
    });
    if (!patient) {
        return res.status(404).json({ success: false, msg: `No patient found for this id: ${id}` });
    }
    res.status(200).json({ success: true, patient });
});

// @desc    Delete specific patient
// @route   DELETE /api/v1/patients/:id
// @access  Private
exports.deletePatient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedPatient = await Patient.findByIdAndDelete(id);
    if (!deletedPatient) {
        return res.status(404).json({ success: false, msg: `No patient found for this id: ${id}` });
    }
    res.status(204).json({ success: true, data: {} });
});

// @desc   Delete All Patients
// @route  DELETE /api/v1/patients
// @access Private
exports.deleteAll = asyncHandler(async (req, res) => {
    await Patient.deleteMany({});
    res.json({ message: 'All patients have been deleted.' });
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