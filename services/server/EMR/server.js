// Core Modules
const bodyParser = require('body-parser');
// const path = require('path');

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

const PORT = process.env.PORT || 8000;

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

