// Core Modules
const bodyParser = require('body-parser');
const net = require('net');
const axios = require('axios');

// Third Party Modules
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Project Files
dotenv.config({ path: 'config.env' });
const ApiError = require('./utils/apiError');
const dbConncetion = require('./config/database');
const globalError = require('./middlewares/errorMiddleware');

// REQUIRING ROUTES
const mountRoutes = require('./routes');

// Connect the database
dbConncetion();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Handle requests for /favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// MOUNT ROUTES
mountRoutes(app);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`${process.env.NODE_ENV}`);
}

// WORKS WHEN THE URL IS NOT IN THE PREDEFINED URIS
app.all("*", (req, res, next) => {
  // CREATE ERROR AND SEND IT TO GLOBAL ERROR HANDLING MIDDLEWARE
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// GLOBAL ERROR HANDLING MIDDLEWARE FOR EXPRESS
// EXPLAINATION: any error occurs in req - res process is caught here.
app.use(globalError);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`App is Running on Port ${PORT}`);
});

// HANDLING REJECTION OUTSIDE EXPRESS
// EXPLAINATION: IT IS FOR ERRORS OUT OF EXPRESS, COULD BE WRONG URL DATABASE CONNECTION THAT IS IN config.env FILE
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
// ################################################################################################################




// function parseData(data) {

//   data = data.toString('utf-8');

//   // Split data by line breaks
//   const lines = data.split('\r\n');

//   // Extract request line
//   const requestLine = lines[0];

//   // Split request line to extract method, URL, and HTTP version
//   const [method, url, httpVersion] = requestLine.split(' ');

//   // Output the extracted method and URL
//   return { method, url };
// }


// // Function to send data to Express app
// async function sendDataToExpress(headers, data) {
//   try {
//     const { method, url } = parseData(data);
//     const response = await axios({
//       method: method,
//       url: `http://localhost:8000${url}`,
//       headers: headers,
//       data: data
//     });
//     console.log('Response from Express app:', response.data);
//   } catch (error) {
//     console.error('Error sending data to Express app:', error.message);
//   }
// }

// const PORT = 8000;

// // Create a TCP server
// const server = net.createServer((socket) => {
//   console.log('TCP connection established');
  
//   // Initialize headers variable to store headers
//   let headers = '';

//   // TCP data handler
//   socket.on('data', (data) => {
    
//     // Check if headers are not yet collected
//     if (!headers) {
//       // Extract headers from data until you find an empty line
//       const dataString = data.toString('utf-8');
//       const headerEndIndex = dataString.indexOf('\r\n\r\n');
//       if (headerEndIndex !== -1) {
//         // Extract headers and remaining data
//         headers = dataString.substring(0, headerEndIndex);
//         const remainingData = dataString.substring(headerEndIndex + 4);
//         console.log(`Received headers: ${headers}`);
//         console.log(`Remaining data: ${remainingData}`);
//         // Call createAppointment with both headers and remaining data
//         sendDataToExpress(headers, data);
//         createAppointment(headers, remainingData);
//       } else {
//         // If headers are not fully received, accumulate them
//         headers += dataString;
//       }
//     } else {
//       // If headers are already collected, pass data directly to createAppointment
//       console.log(`Received data: ${data}`);
//       sendDataToExpress(headers, data);
//       createAppointment(headers, data);
//     }
//   });

//   // TCP connection close handler
//   socket.on('close', () => {
//     console.log('TCP connection closed');
//     // Handle TCP connection closure here
//     console.log("BYE BYE")
//   });
// });

// server.listen(PORT, () => {
//   console.log(`App is Running on Port ${PORT}`);
// });


// Function to simulate createAppointment
function createAppointment(headers, data) {
  // Here you can process both headers and data
  console.log('Creating appointment...');
  console.log('Headers:', headers);
  console.log('Data:', data.toString('utf-8'));
}

// ##################################################### CONTROLLER PART ###################################################
const HealthcareProvider = require('./models/healthcareProviderModel');

// function createAppointment(data) {
//   const dataString = data.toString('utf-8');
//   console.log(dataString);
  
  // const { id } = req.params;

  // parseHL7Message(data)
  //   .then((message) => {
  //     const appointmentDataARQ = message['2']['fields'];
  //     const appointmentDataAIS = message['3']['fields'];

  //     // Extracting the data from the ARQ Segment
  //     let appointmentReason = appointmentDataARQ['Appointment Reason'];
  //     let appointmentDuration = appointmentDataARQ['Appointment Duration'];
  //     let requestedStartDateTimeRange = appointmentDataARQ['Requested Start Date/Time Range'];
  //     let priorityARQ = appointmentDataARQ['Priority-ARQ'];
  //     let repeatingInterval = appointmentDataARQ['Repeating Interval'];
  //     let repeatingIntervalDuration = appointmentDataARQ['Repeating Interval Duration'];
  //     let placerContactPerson = appointmentDataARQ['Placer Contact Person'];
  //     let PlacerContactPhoneNumber = appointmentDataARQ['Placer Contact Phone Number'];

  //     // Extracting the data from the AIS Segment
  //     let appointmentTime = appointmentDataAIS['Start Date/Time'];

  //     // Validating appointmentDuration
  //     const regex = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])$/;

  //     if (!regex.test(appointmentDuration)) {
  //       return res.status(404).json({ success: false, msg: `Please enter a valid duration time between 0 and 24 hours` });
  //     }

  //     const splittedDateTime = requestedStartDateTimeRange.split('T');
  //     const appointmentDate = splittedDateTime[0];
  //     appointmentTime = splittedDateTime[1];

  //     // Validating the requestedStartDateTimeRange
  //     const parsedDate = new Date(appointmentDate);

  //     if (!(!isNaN(parsedDate.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(appointmentDate))) {
  //       return res.status(404).json({ success: false, msg: `Please enter a valid date` });
  //     }

  //     // Check if the date is already booked
  //     HealthcareProvider.findOne({
  //       _id: id,
  //       'schedule.requestedStartDateTimeRange': requestedStartDateTimeRange
  //     })
  //       .then((existingAppointmentDate) => {
  //         // Check if the date is already booked
  //         HealthcareProvider.findOne({
  //           _id: id,
  //           'schedule.appointmentTime': appointmentTime
  //         })
  //           .then((existingAppointmentTime) => {
  //             if (existingAppointmentDate && existingAppointmentTime) {
  //               return res.status(400).json({ success: false, msg: `An appointment already exists for this date and time` });
  //             }

  //             const bodyObject = {
  //               "appointmentReason": appointmentDataARQ['Appointment Reason'],
  //               "appointmentTime": appointmentTime,
  //               "appointmentDuration": appointmentDataARQ['Appointment Duration'],
  //               "requestedStartDateTimeRange": appointmentDataARQ['Requested Start Date/Time Range'],
  //               "priorityARQ": appointmentDataARQ['Priority-ARQ'],
  //               "repeatingInterval": appointmentDataARQ['Repeating Interval'].replace('^', " "),
  //               "repeatingIntervalDuration": appointmentDataARQ['Repeating Interval Duration'].replace('^', " "),
  //               "placerContactPerson": appointmentDataARQ['Placer Contact Person'].replace('^', " "),
  //               "PlacerContactPhoneNumber": appointmentDataARQ['Placer Contact Phone Number'],
  //             };

  //             HealthcareProvider.findById(id)
  //               .then((healthcareProvider) => {
  //                 if (!healthcareProvider) {
  //                   return res.status(404).json({ success: false, msg: `No healthcare provider found for this id: ${id}` });
  //                 }

  //                 // Push the new appointment data
  //                 healthcareProvider.schedule.push(bodyObject);

  //                 // Save the updated document
  //                 healthcareProvider.save()
  //                   .then(() => {
  //                     // Convert appointment data to JSON string
  //                     const jsonData = JSON.stringify(bodyObject);

  //                     // Send appointment data over TCP
  //                     sendDataOverTCP(jsonData);

  //                     res.status(200).json({ success: true, healthcareProvider });
  //                   })
  //                   .catch((err) => {
  //                     console.error(err);
  //                     res.status(500).json({ success: false, msg: "Error saving appointment data" });
  //                   });
  //               })
  //               .catch((err) => {
  //                 console.error(err);
  //                 res.status(500).json({ success: false, msg: "Error finding healthcare provider" });
  //               });
  //           })
  //           .catch((err) => {
  //             console.error(err);
  //             res.status(500).json({ success: false, msg: "Error checking existing appointment time" });
  //           });
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //         res.status(500).json({ success: false, msg: "Error checking existing appointment date" });
  //       });
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     res.status(500).json({ success: false, msg: "Error parsing HL7 message" });
  //   });
// }

function parseHL7Message(message) {
  return new Promise((resolve, reject) => {
    const segments = message.split('\r');

    const parsedMessage = {};

    segments.forEach((segment, index) => {
      const fields = segment.split('|');
      const segmentName = fields[0];
      const segmentFields = {};

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

      const fieldNamesAIS = [
        'Set ID - AIS', 'Segment Action Code', 'Universal Service ID', 'Start Date/Time', 'Start Date/Time Offset',
        'Start Date/Time Offset Units', 'Duration', 'Duration Units', 'Allow Substitution Code', 'Filler Status Code'
      ];

      const fieldNames = segmentName === 'MSH' ? fieldNamesMSH : (segmentName === 'ARQ' ? fieldNamesARQ : fieldNamesAIS);

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
}

