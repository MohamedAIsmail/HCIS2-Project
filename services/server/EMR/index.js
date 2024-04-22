const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// REQUIRING ROUTES
const patientRoute = require('./routes/patientRouter');

dotenv.config({ path: 'config.env' });

const dbConncetion = require('./config/database');

// Connect the database
dbConncetion();

const app = express();
app.use(cors());

// Middlewares
app.use(express.json());

// Parse application/json
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`${process.env.NODE_ENV}`);
}

// WORKS WHEN THE URL IS NOT IN THE PREDEFINED URIS
// app.all("*", (req, res, next) => {
//   // CREATE ERROR AND SEND IT TO GLOBAL ERROR HANDLING MIDDLEWARE
//   next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
// });
// Handle requests for /favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

const PORT = process.env.PORT || 8000;

app.use('/', patientRoute);

const server = app.listen(PORT, () => {
  console.log(`App is Runinng  on Port http://localhost:${PORT}/`);
});

// HANDLING REJECTION OUTSIDE EXPRESS
// EXPLAINATION: IT IS FOR ERRORS OUT OF EXPRESS, COULD BE WRONG URL DATABASE CONNECTION THAT IS IN config.env FILE
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Erorrs: ${err.name} | ${err.message}`);
  server.close(() => {
      console.error(`Shutting down....`);
      process.exit(1);
  });
});

