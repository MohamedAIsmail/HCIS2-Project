const hl7 = require('node-hl7');
const asyncHandler = require("express-async-handler");
const Patient = require('../models/patientModel');

exports.handleA01Message = asyncHandler(async (req, res) => {
  try {
    // Parse HL7 message
    const message = hl7.createMessage(req.body.hl7Message);
    
    // Handle admission/visit notification logic here
    // Example:
    const patientData = {
      name: message.segments[2].fields[5].toString(),
      // Extract other patient data from the message
    };

    const patient = await Patient.create(patientData);
    res.status(200).json({ message: 'A01: Patient admitted/visited successfully', patient });
  } catch (error) {
    console.error('Error processing A01 message:', error);
    res.status(500).json({ message: 'Error processing A01 message' });
  }
});
