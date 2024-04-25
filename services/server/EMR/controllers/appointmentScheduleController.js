const asyncHandler = require("express-async-handler");
const HealthcareProvider = require('../models/healthcareProviderModel');

exports.createAppointment = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const message = await parseHL7Message(req.body.hl7Message);

  const patientData = message['2']['fields'];

  const bodyObject = {
      "appointmentReason": patientData['Appointment Reason'],
      "appointmentDuration": patientData['Appointment Duration'],
      "requestedStartDateTimeRange ": patientData['Requested Start Date/Time Range'],
      "priorityARQ": patientData['Priority-ARQ'],
      "repeatingInterval": patientData['Repeating Interval'],
      "repeatingIntervalDuration": patientData['Repeating Interval Duration'],
      "placerContactPerson": patientData['Placer Contact Person'],
      "PlacerContactPhoneNumber": patientData['Placer Contact Phone Number'],
  };

  try {

    let healthcareProvider = await HealthcareProvider.findById(id);
    console.log("after finding el doctor")
    if (!healthcareProvider) {
      return res.status(404).json({ success: false, msg: `No healthcare provider found for this id: ${id}` });
    }

    // Ensure schedule is always an array
    if (!Array.isArray(healthcareProvider.schedule)) {
      healthcareProvider.schedule = [];
    }

    console.log(bodyObject)

    // Push the new appointment data
    healthcareProvider.schedule.push(bodyObject);

    // Save the updated document
    healthcareProvider = await healthcareProvider.save();

    res.status(200).json({ success: true, healthcareProvider });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

async function parseHL7Message(message) {
  return new Promise((resolve, reject) => {

      const segments = message.split('\r');
      console.log(segments)
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

          const fieldNamesARQ = [
              'Appointment ID', 'Filler Appointment ID', 'Occurrence Number', 'Placer Group Number', 'Schedule ID', 
              'Request Event Reason', 'Appointment Reason', 'Appointment Type', 'Appointment Duration', 'Appointment Duration Units',
              'Requested Start Date/Time Range', 'Priority-ARQ', 'Repeating Interval', 'Repeating Interval Duration', 
              'Placer Contact Person', 'Placer Contact Phone Number', 'Placer Contact Address', 'Placer Contact Location', 
              'Entered By Person', 'Entered By Phone Number', 'Entered By Location', 'Parent Placer Appointment ID', 
              'Parent Filler Appointment ID'
          ];

          const fieldNames = segmentName === 'MSH' ? fieldNamesMSH : fieldNamesARQ;

          fields.slice(1).forEach((field, fieldIndex) => {
              segmentFields[fieldNames[fieldIndex]] = field;
          });

          parsedMessage[index + 1] = {
              segment: segmentName,
              fields: segmentFields
          };
      });

      resolve(parsedMessage);
  });
};
