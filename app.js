/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const errorHandler = require('./errors/ErrorHandler');

const PORT = 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();
app.use(express.json());
app.use(limiter);
app.use(helmet());
app.use('/', routes);
app.use(errors());
app.use(errorHandler);
mongoose.connect('mongodb://localhost:27017/mestodb', () => {
  console.log('Connected mongoDB');
  app.listen(PORT, () => {
    console.log(`App listening ${PORT}`);
  });
});
