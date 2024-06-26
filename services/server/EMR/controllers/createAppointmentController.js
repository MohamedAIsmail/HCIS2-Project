const asyncHandler = require("express-async-handler");
const HealthcareProvider = require('../models/healthcareProviderModel');

exports.createAppointment = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const message = await parseHL7Message(req.body.hl7Message);

  const appointmentDataARQ = message['2']['fields'];

  const appointmentDataAIS = message['3']['fields'];

  // Extracting the data from the ARQ Segment
  let appointmentDuration = appointmentDataARQ['Appointment Duration']
  let requestedStartDateTimeRange = appointmentDataARQ['Requested Start Date/Time Range']

  // Extracting the data from the AIS Segment
  let appointmentTime = appointmentDataAIS[ 'Start Date/Time']

  // Validating appointmentDuration
  const regex = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])$/;



  const splittedDateTime =  requestedStartDateTimeRange.split('T');
  const appointmentDate = splittedDateTime[0];
  appointmentTime = splittedDateTime[1];

  // Validating the requestedStartDateTimeRange
  const parsedDate = new Date(appointmentDate);

  // if (!(!isNaN(parsedDate.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(appointmentDate))) {
  //   return res.status(404).json({ success: false, message: `Please enter a valid date` });
  // }

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

  // if (existingAppointmentDate && existingAppointmentTime) {
  //   return res.status(400).json({ success: false, message: `An appointment already exists for this date and time` });
  // }

  const bodyObject = {
      "appointmentReason": appointmentDataARQ['Appointment Reason'],
      "appointmentTime": appointmentTime,
      "appointmentDuration": appointmentDataARQ['Appointment Duration'],
      "requestedStartDateTimeRange": appointmentDataARQ['Requested Start Date/Time Range'],
      "priorityARQ": appointmentDataARQ['Priority-ARQ'],
      "repeatingInterval": appointmentDataARQ['Repeating Interval'].replace('^', " "),
      "repeatingIntervalDuration": appointmentDataARQ['Repeating Interval Duration'].replace('^', " "),
      "placerContactPerson": appointmentDataARQ['Placer Contact Person'].replace('^', " "),
      "PlacerContactPhoneNumber": appointmentDataARQ['Placer Contact Phone Number'],
  };

  let healthcareProvider = await HealthcareProvider.findById(id);

  // if (!healthcareProvider) {
  //   return res.status(404).json({ success: false, message: `No healthcare provider found for this id: ${id}` });
  // }

  healthcareProvider.schedule.push(bodyObject);

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
              'Request Event Reason', 'Appointment Reason', 'Appointment Type', 'Appointment Duration', 'Appointment Duration Units',
              'Requested Start Date/Time Range', 'Priority-ARQ', 'Repeating Interval', 'Repeating Interval Duration', 
              'Placer Contact Person', 'Placer Contact Phone Number', 'Placer Contact Address', 'Placer Contact Location', 
              'Entered By Person', 'Entered By Phone Number', 'Entered By Location', 'Parent Placer Appointment ID', 
              'Parent Filler Appointment ID'
          ];

          const fileNamesAIS = [ 
            'Set ID - AIS', 'Segment Action Code', 'Universal Service ID', 'Start Date/Time', 'Start Date/Time Offset', 
            'Start Date/Time Offset Units', 'Duration', 'Duration Units', 'Allow Substitution Code', 'Filler Status Code'
          ];

          const fieldNames = segmentName === 'MSH' ? fieldNamesMSH : (segmentName === 'ARQ' ? fieldNamesARQ : fileNamesAIS);

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
