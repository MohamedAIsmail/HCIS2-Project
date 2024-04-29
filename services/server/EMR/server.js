// Core Modules
const bodyParser = require('body-parser');

// Third Party Modules
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const net = require('net');

// Project Files
dotenv.config({ path: 'config.env' });
const ApiError = require('./utils/apiError');
const dbConncetion = require('./config/database');
const globalError = require('./middlewares/errorMiddleware');
const { createAppointment, registerPatient } = require('./HL7scenarios');

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

// Handle requests for /favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// MOUNT ROUTES
mountRoutes(app);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`${process.env.NODE_ENV}`);
};

// WORKS WHEN THE URL IS NOT IN THE PREDEFINED URIS
app.all("*", (req, res, next) => {
  // CREATE ERROR AND SEND IT TO GLOBAL ERROR HANDLING MIDDLEWARE
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// GLOBAL ERROR HANDLING MIDDLEWARE FOR EXPRESS
// EXPLAINATION: any error occurs in req - res process is caught here
app.use(globalError);

const PORT = process.env.PORT || 8000;

// Starting the Express server on port 8000
app.listen(PORT, () => {
  console.log('Express server is running on port 8000');
});

// ######################################### TCP SERVER #########################################

const tcpServer = net.createServer(async (socket) => {

  console.log('TCP Server: Client connected'); 
  let receivedData = '';

  socket.on('data', async (data) => {

    receivedData += data.toString();
    const parsedData = JSON.parse(receivedData);
    const scenario = parsedData.scenario;
    delete parsedData['scenario'];

    let response;

    if (scenario === "createAppointment") {
      const id = parsedData.id;
      delete parsedData['id'];

      response = await createAppointment(parsedData, id);
      console.log(response)
    } else {
      response = await registerPatient(parsedData);
    }

    socket.write(JSON.stringify(response));
  });
  
  socket.on('end', async () => {
    console.log('inside end socket');
  });

  socket.on('close', () => {
    console.log('TCP Server: Client disconnected');
  });
});

tcpServer.listen(3000, () => {
  console.log('TCP Server is running on port 3000');
});