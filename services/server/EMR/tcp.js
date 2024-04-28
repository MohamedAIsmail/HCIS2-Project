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
const PatientAccount = require("./models/patientAccountModel");
const Test = require("./models/testModel");

// REQUIRING ROUTES
const mountRoutes = require('./routes');

// Connect the database
dbConncetion();

// Creating express applicaiton
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// // Handle requests for /favicon.ico
// app.get('/favicon.ico', (req, res) => {
//   res.status(204).end();
// });

// MOUNT ROUTES
// mountRoutes(app);

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
//   console.log(`${process.env.NODE_ENV}`);
// }

// // WORKS WHEN THE URL IS NOT IN THE PREDEFINED URIS
// app.all("*", (req, res, next) => {
//   // CREATE ERROR AND SEND IT TO GLOBAL ERROR HANDLING MIDDLEWARE
//   next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
// });

// // GLOBAL ERROR HANDLING MIDDLEWARE FOR EXPRESS
// // EXPLAINATION: any error occurs in req - res process is caught here.
// app.use(globalError);

const PORT = process.env.PORT || 8000;

// Define a route to handle the POST request
app.post('/api/v1/test', async (req, res) => {
    console.log("Magdy inside the controller post")
    const test = await Test.create(req.body);
    res.status(201).json({ test });
});

app.get('/api/v1/test', async (req, res) => {
    console.log("Magdy inside the controller get")
    const tests = await Test.find({});
    res.status(200).json({ tests });
});

// Starting the Express server on port 8000
app.listen(PORT, () => {
  console.log('Express server is running on port 8000');
});

// #########################################All the above are the server.js code#########################################

// Creating a TCP server
const tcpServer = net.createServer(async (socket) => {
  console.log('TCP Server: Client connected'); 

  // Handle incoming data
  let receivedData = '';
  socket.on('data', async (data) => {
    receivedData += data.toString();
    console.log('TCP Server: received data:', receivedData)
    const parsedData = JSON.parse(receivedData);
    console.log('TCP Server: Parsed data:', parsedData)
    const response = await axios.post('http://localhost:8000/api/v1/test', parsedData);
    console.log('POST request response:', response.data);
  });
  
  // Handle end of data transmission
  socket.on('end', async () => {
    console.log('TCP Server: Received data:', receivedData);

    try {
      // Parse the received data as JSON
      const parsedData = JSON.parse(receivedData);
      console.log('TCP Server: Parsed data:', parsedData)

      // Use Express app to process the data and make a POST request
      const response = await axios.post('http://localhost:8000/api/v1/test', parsedData);

      console.log('POST request response:', response.data);
    } catch (error) {
      console.error('Error processing data:', error.message);
    }
  });

  // Handle connection closed
  socket.on('close', () => {
    console.log('TCP Server: Client disconnected');
  });
});

// Starting the TCP server on port 3000
tcpServer.listen(3000, () => {
  console.log('TCP Server is running on port 3000');
});
