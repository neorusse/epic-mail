/**
 * Module dependencies
 */

import app from '../app';
import http from 'http';
import dotenv from 'dotenv';
import chalk from 'chalk';

// import env variables from our .env file
dotenv.config();

// Start our App
app.set('port', process.env.PORT || 1091);

const server = http.createServer(app);

server.listen(app.get('port'), () => {
  console.log(`Server running on PORT ${chalk.blue(server.address().port)}`);
});
