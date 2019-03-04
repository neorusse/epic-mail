/**
 * Module dependencies
 */

import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

// Enables node runtime to recognise async/await and Promise
import '@babel/polyfill';

// Initialize the Express App
const app = new express();

// logs HTTP requests
app.use(logger('dev'));

// Takes the raw request and turns them into usable properties of req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Allows Cross Origin Resource Sharing
app.use(cors());

// Route Route
app.get('/', (req, res) => {
  res.status(200).send({ info: 'Welcome to EPICMail' });
});

// Catch 404 Error & forward to Error Handler
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Error Handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

export default app;
