const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Load routes
const bootcamps = require('./routes/bootcamps');

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// Logging middle middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount the routes
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `Server listening in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
