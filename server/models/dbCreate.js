import { Pool } from 'pg';
import dbTableSchema from './dbSchema';
//import dbConfig from './dbConfig'
import dotenv from 'dotenv';

dotenv.config();

// Connect with database
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
console.log(process.env.DATABASE_URL, '+++++++++++++++++++++++++++++');

// Table Creation
const createTables = () => {
  pool.connect()
    .then((client) => {
      client.query(dbTableSchema)
        .then((res) => {
          console.log(res);
          client.end();
        })
        .catch((err) => {
          client.end()
          console.log(err)
        });
    });
}

// DB Query Method
module.exports = {
  createTables
};

// Expose exported function to the command line
require('make-runnable');


