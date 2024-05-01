// Core Modules
const bodyParser = require("body-parser");
const path = require('path');

// Third Party Modules
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const http = require('http');
const socketIo = require('socket.io');

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

const PORT = process.env.PORT || 8000;

// Starting the Express server on port 8000
app.listen(PORT, () => {
    console.log("Express server is running on port 8000");
});

// ######################################### TCP SERVER #########################################

const server = http.createServer(app);

// Setup CORS
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  // This should match the URL of your client app
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('sendData', async (data) => {

    const parsedData = JSON.parse(data);

    const scenario = parsedData.scenario;
    delete parsedData["scenario"];

    let response;

    if (scenario === "createAppointment") {
        const id = parsedData.id;
        delete parsedData["id"];
        response = await createAppointment(parsedData, id);
    } else {
        response = await registerPatient(parsedData);
        console.log(response)

    }

    socket.write(JSON.stringify(response));
    });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(8080, () => {
  console.log('Listening on port 8080');
});