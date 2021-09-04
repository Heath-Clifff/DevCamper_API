const fileupload = require('express-fileupload');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

connectDB();

// Load routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

const app = express();

// Body Parser
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Logging middle middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Mount the routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `Server listening in ${process.env.NODE_ENV} mode on port ${PORT}`.blue.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server and exit process
  server.close(() => process.exit(1));
});
