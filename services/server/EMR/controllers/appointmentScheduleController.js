const asyncHandler = require("express-async-handler");
const HealthcareProvider = require('../models/healthcareProviderModel');

exports.createAppointment = asyncHandler(async (req, res) => {

  const { id } = req.params;

  let hl7Message = JSON.stringify(req.body.hl7Message, null, 2);

  hl7Message = hl7Message.replace(/"/g, '');

  const message = await parseHL7Message(hl7Message);

  const patientData = message['2']['fields'];

  // Extracting the date
  let appointmentReason = patientData['Appointment Reason']
  let appointmentTime = patientData['Appointment Time']
  let appointmentDuration = patientData['Appointment Duration']
  let requestedStartDateTimeRange = patientData['Requested Start Date/Time Range']
  let priorityARQ = patientData['Priority-ARQ']
  let repeatingInterval = patientData['Repeating Interval']
  let repeatingIntervalDuration =  patientData['Repeating Interval Duration']
  let placerContactPerson = patientData['Placer Contact Person']
  let PlacerContactPhoneNumber = patientData['Placer Contact Phone Number']

  // Validating appointmentDuration
  const regex = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])$/;

  if (!regex.test(appointmentDuration)) {
    return res.status(404).json({ success: false, msg: `Please enter a valid duration time between 0 and 24 hours` });
  }

  // Validating the requestedStartDateTimeRange
  const parsedDate = new Date(requestedStartDateTimeRange);

  if (!(!isNaN(parsedDate.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(requestedStartDateTimeRange))) {
    return res.status(404).json({ success: false, msg: `Please enter a valid date` });
  }

  // Check if the date is already booked
  const existingAppointmentDate = await HealthcareProvider.findOne({
    _id: id,
    'schedule.requestedStartDateTimeRange': requestedStartDateTimeRange
  });

  // Check if the date is already booked
  const existingAppointmentTime = await HealthcareProvider.findOne({
    _id: id,
    'schedule.appointmentTime': appointmentTime
  });

  if (existingAppointmentDate && existingAppointmentTime) {
    return res.status(400).json({ success: false, msg: `An appointment already exists for this date and time` });
  }

  const bodyObject = {
      "appointmentReason": patientData['Appointment Reason'],
      "appointmentTime": patientData['Appointment Time'],
      "appointmentDuration": patientData['Appointment Duration'],
      "requestedStartDateTimeRange": patientData['Requested Start Date/Time Range'],
      "priorityARQ": patientData['Priority-ARQ'],
      "repeatingInterval": patientData['Repeating Interval'].replace('^', " "),
      "repeatingIntervalDuration": patientData['Repeating Interval Duration'].replace('^', " "),
      "placerContactPerson": patientData['Placer Contact Person'].replace('^', " "),
      "PlacerContactPhoneNumber": patientData['Placer Contact Phone Number'],
  };

  let healthcareProvider = await HealthcareProvider.findById(id);

  if (!healthcareProvider) {
    return res.status(404).json({ success: false, msg: `No healthcare provider found for this id: ${id}` });
  }

  // Push the new appointment data
  healthcareProvider.schedule.push(bodyObject);

  // Save the updated document
  healthcareProvider = await healthcareProvider.save();

  res.status(200).json({ success: true, healthcareProvider });
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

          const fieldNamesARQ = [
              'Appointment ID', 'Filler Appointment ID', 'Occurrence Number', 'Placer Group Number', 'Schedule ID', 
              'Request Event Reason', 'Appointment Reason', 'Appointment Time', 'Appointment Type', 'Appointment Duration', 'Appointment Duration Units',
              'Requested Start Date/Time Range', 'Priority-ARQ', 'Repeating Interval', 'Repeating Interval Duration', 
              'Placer Contact Person', 'Placer Contact Phone Number', 'Placer Contact Address', 'Placer Contact Location', 
              'Entered By Person', 'Entered By Phone Number', 'Entered By Location', 'Parent Placer Appointment ID', 
              'Parent Filler Appointment ID'
          ];

          const fieldNames = segmentName === 'MSH' ? fieldNamesMSH : fieldNamesARQ;

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
