const hl7 = require('node-hl7');
const asyncHandler = require("express-async-handler");
const Patient = require('../models/patientModel');

exports.handleA04Message = asyncHandler(async (req, res) => {
  // Parse HL7 message
  const message = hl7.parse(req.body.hl7Message);
  
  // Handle patient registration logic here
  // Example:
  const patientData = {
    name: message.segments[2].fields[5].toString(),
    // Extract other patient data from the message
  };

  const patient = await Patient.create(patientData);
  res.status(200).send('A04: Patient registered successfully', patient);
});

exports.constructHL7Message = (patientData){
  
}