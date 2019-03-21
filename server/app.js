/**
 * Module dependencies
 */
import express from 'express';
import '@babel/polyfill';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';

// importing routes
import messages from './routes/message';
import users from './routes/user'
import groups from './routes/group'


import dotenv from 'dotenv';

dotenv.config();

// Initialize the Express App
const app = new express();

// logs HTTP requests
app.use(logger('dev'));

// Takes the raw request and turns them into usable properties of req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Allows Cross Origin Resource Sharing
app.use(cors());

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({ info: 'Welcome to EPICMail' });
});

// API Documentation
const swaggerAPIDef = require('../apiDoc.json');
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerAPIDef));

// route handler
app.use('/api/v1/messages', messages);
app.use('/api/v1/auth', users);
app.use('/api/v1/groups', groups);


// Catch 404 Error & forward to Error Handler
app.use((req, res, next) => {
  const error = new Error('Route does not exist');
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
