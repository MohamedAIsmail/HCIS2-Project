// Core Modules
const bodyParser = require("body-parser");

// Third Party Modules
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const net = require("net");

// Project Files
dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const dbConncetion = require("./config/database");
const globalError = require("./middlewares/errorMiddleware");
const { createAppointment, registerPatient } = require("./HL7scenarios");

// REQUIRING ROUTES
const mountRoutes = require("./routes");

// Connect the database
dbConncetion();

// Creating express applicaiton
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Handle requests for /favicon.ico
app.get("/favicon.ico", (req, res) => {
    res.status(204).end();
});

// MOUNT ROUTES
mountRoutes(app);

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log(`${process.env.NODE_ENV}`);
}

// WORKS WHEN THE URL IS NOT IN THE PREDEFINED URIS
app.all("*", (req, res, next) => {
    // CREATE ERROR AND SEND IT TO GLOBAL ERROR HANDLING MIDDLEWARE
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// GLOBAL ERROR HANDLING MIDDLEWARE FOR EXPRESS
// EXPLAINATION: any error occurs in req - res process is caught here
app.use(globalError);

const PORT = 8000;

// Starting the Express server on port 8000
app.listen(PORT, () => {
    console.log("Express server is running on port 8000");
});

// ######################################### TCP SERVER #########################################
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = require('socket.io-client');

// Setup CORS
const io_server = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  // This should match the URL of your client app
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

const otherServerSocket = io('http://192.168.8.8:8500', {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

io_server.on('connection', (socket) => {
  console.log('New client connected');
  
  // Reciving data on sendData
  socket.on('sendData', async (data) => {
    console.log("Data sent:" + data);
    const parsedData = JSON.parse(data);
    const scenario = parsedData.scenario;
    delete parsedData["scenario"];
    let response;
    otherServerSocket.emit('sendDataToServer', data);
    otherServerSocket.on('response', (responseData) => {
      response = responseData;
      // console.log("Response Back:" + response);
      socket.write(JSON.stringify(response));
    });
    socket.write(JSON.stringify(response));
    });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(8080, () => {
  console.log('Listening on port ' + 8080);
});

