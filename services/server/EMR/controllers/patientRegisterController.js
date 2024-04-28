const asyncHandler = require("express-async-handler");
const PatientRegister = require('../models/patientRegisterModel');

exports.registerPatient = asyncHandler(async (req, res) => {

    const message = await parseHL7Message(req.body.hl7Message);

    const patientData = message['3']['fields'];

    const bodyObject = {
        "setID": patientData['Set ID - PID'],
        "patientID": patientData['Patient ID'],
        "patientIdentifierList": patientData['Patient Identifier List'],
        "alternatePatientID": patientData['Alternate Patient ID - PID'],
        "patientName": patientData['Patient Name'],
        "mothersMaidenName": patientData['Mothers Maiden Name'],
        "dateTimeOfBirth": patientData['Date/Time of Birth'],
        "sex": patientData['Sex'],
        "patientAlias": patientData['Patient Alias'],
        "race": patientData['Race'],
        "patientAddress": patientData['Patient Address'],
        "countyCode": patientData['County Code'],
        "phoneNumberHome": patientData['Phone Number - Home'],
        "phoneNumberBusiness": patientData['Phone Number - Business'],
        "primaryLanguage": patientData['Primary Language'],
        "maritalStatus": patientData['Race'],
        "religion": patientData['Religion'],
        "patientAccountNumber": patientData['Patient Account Number'],
        "ssnNumberPatient": patientData['SSN Number - Patient'],
        "driverLicenseNumberPatient": patientData['Driver License Number - Patient'],
        "motherIdentifier": patientData['Mother Identifier'],
        "ethnicGroup": patientData['Ethnic Group'],
        "birthPlace": patientData['Birth Place'],
        "multipleBirthIndicator": patientData['Multiple Birth Indicator'],
        "birthOrder": patientData['Birth Order'],
        "citizenship": patientData['Citizenship'],
        "veteransMilitaryStatus": patientData['Veterans Military Status'],
        "nationality": patientData['Nationality'],
        "patientDeathDateTime": patientData['Patient Death Date and Time'],
        "patientDeathIndicator": patientData['Patient Death Indicator']
    };
    
    const patient = await PatientRegister.create( bodyObject );
    res.status(200).send( patient );
});

async function parseHL7Message(message) {
    return new Promise((resolve, reject) => {

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

            const fieldNamesPID = [
                'Set ID - PID', 'Patient ID', 'Patient Identifier List', 'Alternate Patient ID - PID',
                'Patient Name', 'Mothers Maiden Name', 'Date/Time of Birth', 'Sex', 'Patient Alias',
                'Race', 'Patient Address', 'County Code', 'Phone Number - Home', 'Phone Number - Business',
                'Primary Language', 'Marital Status', 'Religion', 'Patient Account Number', 'SSN Number - Patient',
                'Driver License Number - Patient', 'Mother Identifier', 'Ethnic Group', 'Birth Place',
                'Multiple Birth Indicator', 'Birth Order', 'Citizenship', 'Veterans Military Status',
                'Nationality', 'Patient Death Date and Time', 'Patient Death Indicator'
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
                'Newborn Baby Indicator', 'Baby Detained Indicator'
            ];

            const fieldNames = segmentName === 'MSH' ? fieldNamesMSH :
                (segmentName === 'EVN' ? fieldNamesEVN :
                    (segmentName === 'PID' ? fieldNamesPID : fieldNamesPV1));

            fields.slice(1).forEach((field, fieldIndex) => {
                const fieldValue = field.replace(/\^/g, ' ');
                segmentFields[fieldNames[fieldIndex]] = fieldValue;
            });

            parsedMessage[index + 1] = {
                segment: segmentName,
                fields: segmentFields
            };
        });

        resolve(parsedMessage);
    });
};
